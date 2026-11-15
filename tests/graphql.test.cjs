'use strict';

const assert = require('node:assert/strict');
const { registerHooks } = require('node:module');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test } = require('node:test');
const { createGraphQLClient } = require('../src/lib/graphql-client');
const { postsSelection, pagesSelection } = require('../src/lib/graphql-selections');

const endpoint = 'https://wordpress.test/graphql';
const response = (data) => Response.json({ data });
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (/^(lib|data)\//.test(specifier)) {
      return nextResolve(pathToFileURL(path.join(__dirname, '../src', `${specifier}.js`)).href, context);
    }
    return nextResolve(specifier, context);
  },
});

test('identical reads deduplicate pending work and retain successful responses', async () => {
  const wait = deferred();
  let calls = 0;
  const client = createGraphQLClient(endpoint, {
    fetch: async () => {
      calls++;
      return wait.promise;
    },
  });
  const reads = Array.from({ length: 10 }, () => client.query({ query: 'query Read { value }' }));
  assert.equal(calls, 1);
  wait.resolve(response({ value: 1 }));
  const results = await Promise.all(reads);
  assert.deepEqual(
    results,
    Array.from({ length: 10 }, () => ({ data: { value: 1 } }))
  );
  await client.query({ query: 'query Read { value }', variables: {} });
  assert.equal(calls, 1);
});

test('keys normalize object order but distinguish documents, variables, arrays and endpoints', async () => {
  const requests = [];
  const fetch = async (url, options) => {
    requests.push({ url, ...JSON.parse(options.body) });
    return response({ value: 1 });
  };
  const client = createGraphQLClient(`${endpoint}/`, { fetch });
  const query = 'query Shared($input: Input) { value(input: $input) }';
  await client.query({ query, variables: { input: { b: 2, a: { y: 2, x: 1 } } } });
  await client.query({ query, variables: { input: { a: { x: 1, y: 2 }, b: 2 } } });
  assert.equal(requests.length, 1);
  await client.query({ query, variables: { input: [1, 2] } });
  await client.query({ query, variables: { input: [2, 1] } });
  await client.query({ query, variables: { input: '1' } });
  await client.query({ query, variables: { input: 1 } });
  await client.query({ query: 'query Shared { value extra }' });
  await client.query({ query: 'query Shared { value(text: "a  b") }' });
  await client.query({ query: 'query Shared { value(text: "a b") }' });
  await createGraphQLClient('https://other.test/graphql', { fetch }).query({ query });
  assert.equal(requests.length, 9);
  assert.equal(requests[0].url, endpoint);
});

test('invalid inputs reject before starting a request', async () => {
  const client = createGraphQLClient(endpoint, { fetch: () => assert.fail('Unexpected fetch') });
  const circular = {};
  circular.self = circular;
  await assert.rejects(client.query({ query: '' }), /non-empty string/);
  await assert.rejects(client.query({ query: '{ value }', variables: [] }), /must be an object/);
  await assert.rejects(client.query({ query: '{ value }', variables: circular }), /non-circular JSON/);
  await assert.rejects(client.query({ query: '{ value }', variables: { value: NaN } }), /JSON/);
  assert.throws(() => createGraphQLClient(undefined), /WORDPRESS_GRAPHQL_ENDPOINT/);
});

test('network and protocol failures reject concurrent readers and allow a subsequent retry', async () => {
  const failures = [
    () => Promise.reject(new Error('Network unavailable')),
    () => new Response('Unavailable', { status: 503 }),
    () => new Response('not JSON'),
    () => Response.json([]),
    () => Response.json({ extensions: {} }),
    () => Response.json({ data: { value: 1 }, errors: [{ message: 'Partial failure' }] }),
    () => Response.json({ errors: [{ message: 'Query failure' }] }),
    () => Response.json({ data: {}, errors: [{ detail: 'invalid error' }] }),
  ];
  for (const fail of failures) {
    let calls = 0;
    const client = createGraphQLClient(endpoint, {
      fetch: async () => {
        calls++;
        return calls === 1 ? fail() : response({ value: 1 });
      },
    });
    const reads = await Promise.allSettled(Array.from({ length: 3 }, () => client.query({ query: '{ value }' })));
    assert.ok(reads.every((result) => result.status === 'rejected'));
    assert.equal(calls, 1);
    assert.equal(client.getCacheStats().entries, 0);
    assert.deepEqual(await client.query({ query: '{ value }' }), { data: { value: 1 } });
    assert.equal(calls, 2);
  }
});

test('timeouts abort the request without poisoning the cache; missing entities remain valid', async () => {
  let calls = 0;
  const client = createGraphQLClient(endpoint, {
    timeoutMs: 5,
    fetch: async (_, { signal }) => {
      calls++;
      if (calls > 1) return response({ post: null });
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve(response({ post: null })), 100);
        signal.addEventListener(
          'abort',
          () => {
            clearTimeout(timer);
            reject(signal.reason);
          },
          { once: true }
        );
      });
    },
  });
  await assert.rejects(client.query({ query: '{ post { id } }' }), /timed out after 5 ms/);
  assert.deepEqual(await client.query({ query: '{ post { id } }' }), { data: { post: null } });
  assert.equal(calls, 2);
});

const node = {
  id: 'post-1',
  databaseId: 1,
  postId: 1,
  date: '2026-01-01',
  isSticky: false,
  slug: 'one',
  title: 'One',
  content: '<p>Content</p>',
  excerpt: 'Excerpt',
  modified: '2026-01-02',
  __typename: 'Post',
  featuredImage: null,
  author: { node: { id: 'author-1', name: 'Author', slug: 'author', avatar: null } },
  categories: {
    edges: [
      { node: { id: 'category-1', databaseId: 1, name: 'First', slug: 'first' } },
      { node: { id: 'category-2', databaseId: 2, name: 'Second', slug: 'second' } },
    ],
  },
};
const posts = { posts: { edges: [{ node }], __typename: 'RootQueryToPostConnection' } };

test('post variants reuse completed and pending richer selections without leaking fields', async () => {
  const docs = await import('../src/data/posts.js');
  for (const pending of [false, true]) {
    const wait = deferred();
    let calls = 0;
    const client = createGraphQLClient(endpoint, {
      fetch: async () => {
        calls++;
        return pending ? wait.promise : response(posts);
      },
    });
    const rich = client.query({ query: docs.QUERY_ALL_POSTS, reuse: postsSelection('all', 'all') });
    if (!pending) await rich;
    const smaller = client.query({ query: docs.QUERY_ALL_POSTS_INDEX, reuse: postsSelection('all', 'index') });
    if (pending) wait.resolve(response(posts));
    const [, index] = await Promise.all([rich, smaller]);
    assert.equal(calls, 1);
    assert.deepEqual(Object.keys(index.data.posts.edges[0].node).sort(), [
      '__typename',
      'categories',
      'databaseId',
      'date',
      'id',
      'isSticky',
      'postId',
      'slug',
      'title',
    ]);
    const archive = await client.query({
      query: docs.QUERY_ALL_POSTS_ARCHIVE,
      reuse: postsSelection('all', 'archive'),
    });
    assert.equal(archive.data.posts.edges[0].node.excerpt, 'Excerpt');
    assert.equal(archive.data.posts.edges[0].node.author.node.name, 'Author');
    assert.ok(!Object.hasOwn(archive.data.posts.edges[0].node, 'content'));
    assert.equal(calls, 1);
  }
});

test('smaller selections cannot satisfy richer ones; author/category arguments do not cross', async () => {
  const docs = await import('../src/data/posts.js');
  let calls = 0;
  const client = createGraphQLClient(endpoint, {
    fetch: async () => {
      calls++;
      return response(posts);
    },
  });
  await client.query({ query: docs.QUERY_ALL_POSTS_INDEX, reuse: postsSelection('all', 'index') });
  await client.query({ query: docs.QUERY_ALL_POSTS_ARCHIVE, reuse: postsSelection('all', 'archive') });
  assert.equal(calls, 2);
  await client.query({
    query: docs.QUERY_POSTS_BY_AUTHOR_SLUG,
    variables: { slug: 'first' },
    reuse: postsSelection('author', 'all'),
  });
  const author = await client.query({
    query: docs.QUERY_POSTS_BY_AUTHOR_SLUG_ARCHIVE,
    variables: { slug: 'first' },
    reuse: postsSelection('author', 'archive'),
  });
  assert.equal(calls, 3);
  assert.ok(!Object.hasOwn(author.data.posts.edges[0].node, 'author'));
  await client.query({
    query: docs.QUERY_POSTS_BY_AUTHOR_SLUG_ARCHIVE,
    variables: { slug: 'second' },
    reuse: postsSelection('author', 'archive'),
  });
  await client.query({
    query: docs.QUERY_POSTS_BY_CATEGORY_ID_ARCHIVE,
    variables: { categoryId: 1 },
    reuse: postsSelection('category', 'archive'),
  });
  await client.query({
    query: docs.QUERY_POSTS_BY_CATEGORY_ID_ARCHIVE,
    variables: { categoryId: 2 },
    reuse: postsSelection('category', 'archive'),
  });
  assert.equal(calls, 6);
});

test('page index/archive alias and full-to-index projection preserve child/parent fields', async () => {
  const docs = await import('../src/data/pages.js');
  let calls = 0;
  const page = {
    id: 'page-1',
    children: { edges: [] },
    menuOrder: 1,
    parent: null,
    slug: 'page',
    title: 'Page',
    uri: '/page/',
    content: 'Content',
    featuredImage: null,
    __typename: 'Page',
  };
  const client = createGraphQLClient(endpoint, {
    fetch: async () => {
      calls++;
      return response({ pages: { edges: [{ node: page }] } });
    },
  });
  await client.query({ query: docs.QUERY_ALL_PAGES, reuse: pagesSelection('all') });
  const index = await client.query({ query: docs.QUERY_ALL_PAGES_INDEX, reuse: pagesSelection('index') });
  await client.query({ query: docs.QUERY_ALL_PAGES_ARCHIVE, reuse: pagesSelection('archive') });
  assert.equal(calls, 1);
  assert.deepEqual(index.data.pages.edges[0].node, {
    id: 'page-1',
    children: { edges: [] },
    menuOrder: 1,
    parent: null,
    slug: 'page',
    title: 'Page',
    uri: '/page/',
    __typename: 'Page',
  });
});

test('LRU and byte budgets include reusable entries without discarding active deduplication', async () => {
  let calls = 0;
  const wait = deferred();
  const client = createGraphQLClient(endpoint, {
    maxEntries: 1,
    fetch: async (_, options) => {
      calls++;
      return JSON.parse(options.body).query === '{ slow }' ? wait.promise : response(posts);
    },
  });
  const slow = client.query({ query: '{ slow }' });
  await client.query({ query: '{ rich }', reuse: postsSelection('all', 'all') });
  await client.query({ query: '{ other }' });
  const duplicate = client.query({ query: '{ slow }' });
  wait.resolve(response({ slow: 1 }));
  await Promise.all([slow, duplicate]);
  assert.equal(calls, 3);
  await client.query({ query: '{ index }', reuse: postsSelection('all', 'index') });
  assert.equal(calls, 4);
  assert.equal(client.getCacheStats().entries, 1);

  const limited = createGraphQLClient(endpoint, {
    maxBytes: 260,
    fetch: async () => response({ value: 'x'.repeat(100) }),
  });
  await limited.query({ query: '{ one }' });
  await limited.query({ query: '{ two }' });
  assert.ok(limited.getCacheStats().bytes <= 260);
  assert.equal(limited.getCacheStats().evictions, 1);
  const oversized = createGraphQLClient(endpoint, { maxBytes: 20, fetch: async () => response(posts) });
  await oversized.query({ query: '{ posts }' });
  await oversized.query({ query: '{ posts }' });
  assert.equal(oversized.getCacheStats().requests, 2);
  assert.equal(oversized.getCacheStats().entries, 0);
});

test('clear prevents old requests from restoring entries or deleting newer pending work', async () => {
  const old = deferred();
  const fresh = deferred();
  let calls = 0;
  const client = createGraphQLClient(endpoint, { fetch: async () => (++calls === 1 ? old.promise : fresh.promise) });
  const first = client.query({ query: '{ value }' });
  client.clear();
  const second = client.query({ query: '{ value }' });
  old.resolve(response({ value: 'old' }));
  await first;
  assert.equal(client.getCacheStats().entries, 0);
  const third = client.query({ query: '{ value }' });
  assert.equal(calls, 2);
  fresh.resolve(response({ value: 'new' }));
  assert.deepEqual(await second, { data: { value: 'new' } });
  await third;
  assert.deepEqual(await client.query({ query: '{ value }' }), { data: { value: 'new' } });
});

test('mapping and related-category consumption leave the cached snapshot unchanged', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => response(posts));
  const previousEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  process.env.WORDPRESS_GRAPHQL_ENDPOINT = endpoint;
  t.after(() => {
    if (previousEndpoint === undefined) delete process.env.WORDPRESS_GRAPHQL_ENDPOINT;
    else process.env.WORDPRESS_GRAPHQL_ENDPOINT = previousEndpoint;
  });
  const { getAllPosts, getRelatedPosts } = await import('../src/lib/posts.js');
  const { getGraphQLClient } = await import('../src/lib/graphql.js');
  const rich = await getAllPosts({ queryIncludes: 'all' });
  const index = await getAllPosts({ queryIncludes: 'index' });
  await getRelatedPosts(index.posts[0].categories, 99);
  index.posts[0].title = 'Changed locally';
  index.posts[0].categories[0].name = 'Changed locally';
  const repeat = await getAllPosts({ queryIncludes: 'index' });
  assert.equal(repeat.posts[0].title, 'One');
  assert.equal(repeat.posts[0].categories.length, 2);
  assert.equal(repeat.posts[0].categories[1].name, 'Second');
  assert.equal(rich.posts[0].categories.length, 2);
  assert.equal(getGraphQLClient().getCacheStats().requests, 2);
  getGraphQLClient().clear();
});
