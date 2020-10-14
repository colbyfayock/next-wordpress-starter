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
    title: decodeHtmlEntities(generalSettings.title),
  };
}

export function decodeHtmlEntities(text) {
  if (typeof text !== 'string') {
    throw new Error(`Failed to decode HTML entity: invalid type ${typeof src}`);
  }

  let decoded = text;

  const entities = {
    '&amp;': '\u0026',
    '&quot;': '\u0022',
    '&#039;': '\u0027',
  };

  return decoded.replace(/&amp;|&quot;|&#039;/g, (char) => entities[char]);
}
