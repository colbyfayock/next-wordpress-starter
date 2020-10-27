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

  let language = generalSettings.language;

  // It looks like the value of `language` when US English is set
  // in WordPress is empty or "", meaning, we have to infer that
  // if there's no value, it's English. On the other hand, if there
  // is a code, we need to grab the 2char version of it to use ofr
  // the HTML lang attribute

  if (!language || language === '') {
    language = 'en';
  } else {
    language = language.split('_')[0];
  }

  return {
    ...generalSettings,
    title: decodeHtmlEntities(generalSettings.title),
    language,
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

export function removeLastTrailingSlash(url) {
  return url.replace(/\/$/, '');
}
