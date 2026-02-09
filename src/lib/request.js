import { removeLastTrailingSlash } from '@/lib/util';

/**
 * Simple hash function to create a short, deterministic tag from a query string.
 * Uses djb2 algorithm - fast and produces good distribution.
 */
function hashQuery(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Convert to unsigned 32-bit integer and then to base36 for shorter string
  return 'gql-' + (hash >>> 0).toString(36);
}

/**
 * gql
 */

export async function gql({ query, variables }) {
  const url = removeLastTrailingSlash(process.env.WORDPRESS_GRAPHQL_ENDPOINT);

  // Create a cache tag from the query + variables for proper cache invalidation
  const cacheKey = JSON.stringify({ query, variables });
  const tag = hashQuery(cacheKey);

  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: {
      tags: [tag],
    },
  }).then((r) => r.json());

  return data;
}
