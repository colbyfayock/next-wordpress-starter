import { removeLastTrailingSlash } from '@/lib/util';

export async function gql({ query, variables }) {
  const url = removeLastTrailingSlash(process.env.WORDPRESS_GRAPHQL_ENDPOINT);

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
      tags: [query],
    },
  }).then((r) => r.json());

  return data;
}
