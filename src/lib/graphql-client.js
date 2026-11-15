const DEFAULT_MAX_ENTRIES = 256;
const DEFAULT_MAX_BYTES = 32 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 30000;

function canonicalVariables(value, ancestors = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'object' || ancestors.has(value)) {
    throw new TypeError('GraphQL variables must contain non-circular JSON values.');
  }
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) {
    throw new TypeError('GraphQL variables must contain plain JSON objects.');
  }
  ancestors.add(value);
  const result = Array.isArray(value)
    ? value.map((item) => canonicalVariables(item, ancestors))
    : Object.fromEntries(
        Object.keys(value)
          .sort()
          .filter((key) => value[key] !== undefined)
          .map((key) => [key, canonicalVariables(value[key], ancestors)])
      );
  ancestors.delete(value);
  return result;
}

function freezeResult(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeResult);
    Object.freeze(value);
  }
  return value;
}

function createGraphQLClient(
  endpoint,
  {
    fetch: fetchRequest = globalThis.fetch,
    maxEntries = DEFAULT_MAX_ENTRIES,
    maxBytes = DEFAULT_MAX_BYTES,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = {}
) {
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new TypeError('WORDPRESS_GRAPHQL_ENDPOINT must be a valid HTTP(S) URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError('WORDPRESS_GRAPHQL_ENDPOINT must be a valid HTTP(S) URL.');
  }
  if (
    typeof fetchRequest !== 'function' ||
    !Number.isInteger(maxEntries) ||
    maxEntries < 0 ||
    !Number.isFinite(maxBytes) ||
    maxBytes < 0 ||
    !Number.isInteger(timeoutMs) ||
    timeoutMs <= 0
  ) {
    throw new TypeError('Invalid GraphQL client cache or timeout settings.');
  }

  const normalizedEndpoint = url.href.replace(/\/$/, '');
  const completed = new Map();
  const pending = new Map();
  const encoder = new TextEncoder();
  const counters = { requests: 0, hits: 0, deduplicated: 0, reused: 0, evictions: 0, oversized: 0 };
  let bytes = 0;
  let generation = 0;

  function touch(key, entry) {
    completed.delete(key);
    completed.set(key, entry);
  }

  function retain(key, result, reuse) {
    const size = encoder.encode(key).byteLength + encoder.encode(JSON.stringify(result)).byteLength;
    if (maxEntries === 0 || size > maxBytes) {
      counters.oversized++;
      return;
    }
    while (completed.size >= maxEntries || bytes + size > maxBytes) {
      const oldest = completed.keys().next().value;
      bytes -= completed.get(oldest).bytes;
      completed.delete(oldest);
      counters.evictions++;
    }
    completed.set(key, { result, bytes: size, reuse });
    bytes += size;
  }

  async function request(query, variables) {
    const signal = AbortSignal.timeout(timeoutMs);
    counters.requests++;
    try {
      const response = await fetchRequest(normalizedEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
        signal,
      });
      if (!response.ok) {
        throw new Error(`WordPress GraphQL request failed with HTTP ${response.status}.`);
      }
      let payload;
      try {
        payload = await response.json();
      } catch (error) {
        if (signal.aborted) throw error;
        throw new Error('WordPress GraphQL returned invalid JSON.', { cause: error });
      }
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('WordPress GraphQL returned an invalid response envelope.');
      }
      if (payload.errors !== undefined) {
        if (!Array.isArray(payload.errors) || payload.errors.some((error) => typeof error?.message !== 'string')) {
          throw new Error('WordPress GraphQL returned malformed errors.');
        }
        if (payload.errors.length > 0) {
          throw new Error(`WordPress GraphQL failed: ${payload.errors.map((error) => error.message).join('; ')}`);
        }
      }
      if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
        throw new Error('WordPress GraphQL returned an invalid data field.');
      }
      return freezeResult({ data: payload.data });
    } catch (error) {
      if (signal.aborted) {
        throw new Error(`WordPress GraphQL request timed out after ${timeoutMs} ms.`, { cause: error });
      }
      throw error;
    }
  }

  async function query({ query: document, variables = {}, reuse } = {}) {
    if (typeof document !== 'string' || document.trim() === '') {
      throw new TypeError('GraphQL query must be a non-empty string.');
    }
    if (!variables || typeof variables !== 'object' || Array.isArray(variables)) {
      throw new TypeError('GraphQL variables must be an object.');
    }
    if (
      reuse &&
      (typeof reuse.family !== 'string' ||
        reuse.family === '' ||
        !Number.isInteger(reuse.rank) ||
        reuse.rank < 0 ||
        typeof reuse.project !== 'function')
    ) {
      throw new TypeError('Invalid GraphQL query selection.');
    }
    const text = document.trim();
    const values = canonicalVariables(variables);
    const key = JSON.stringify([normalizedEndpoint, text, values]);
    const selection = reuse && { family: JSON.stringify([reuse.family, values]), rank: reuse.rank };
    const compatible = (entry) =>
      selection && entry.reuse?.family === selection.family && entry.reuse.rank >= selection.rank;

    if (completed.has(key)) {
      const entry = completed.get(key);
      touch(key, entry);
      counters.hits++;
      return entry.result;
    }
    if (pending.has(key)) {
      counters.deduplicated++;
      return pending.get(key).promise;
    }
    if (selection) {
      for (const [cachedKey, entry] of Array.from(completed).reverse()) {
        if (!compatible(entry)) continue;
        touch(cachedKey, entry);
        counters.reused++;
        return freezeResult(reuse.project(entry.result));
      }
      for (const entry of pending.values()) {
        if (!compatible(entry)) continue;
        counters.reused++;
        return freezeResult(reuse.project(await entry.promise));
      }
    }

    const currentGeneration = generation;
    const entry = { reuse: selection };
    entry.promise = request(text, values)
      .then((result) => {
        if (generation === currentGeneration) retain(key, result, selection);
        return result;
      })
      .finally(() => {
        // An older request must not remove a replacement created after clear().
        if (pending.get(key) === entry) pending.delete(key);
      });
    pending.set(key, entry);
    return entry.promise;
  }

  return {
    query,
    clear() {
      generation++;
      completed.clear();
      pending.clear();
      bytes = 0;
    },
    getCacheStats() {
      return { ...counters, entries: completed.size, pending: pending.size, bytes };
    },
  };
}

module.exports = { createGraphQLClient };
