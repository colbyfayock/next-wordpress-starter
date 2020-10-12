import { getApolloClient } from 'lib/apollo-client';

import { QUERY_SITE_DATA } from 'data/site';

/**
 * getSiteMetadata
 */

export async function getSiteMetadata() {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: QUERY_SITE_DATA,
  });

  const { generalSettings } = data?.data;

  return {
    ...generalSettings,
  };
}
