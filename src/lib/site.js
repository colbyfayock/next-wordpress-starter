import { gql } from '@/lib/request';

import { decodeHtmlEntities } from '@/lib/util';

import { QUERY_SITE_DATA } from '@/data/site';

/**
 * getSiteMetadata
 */

export async function getSiteMetadata() {
  let siteData;

  try {
    siteData = await gql({
      query: QUERY_SITE_DATA,
    });
  } catch (e) {
    console.log(`[site][getSiteMetadata] Failed to query site data: ${e.message}`);
    throw e;
  }

  const { generalSettings } = siteData?.data || {};
  let { language } = generalSettings;

  const settings = {
    ...generalSettings,
    url: process.env.WORDPRESS_SITE_URL,
  };

  // It looks like the value of `language` when US English is set
  // in WordPress is empty or "", meaning, we have to infer that
  // if there's no value, it's English. On the other hand,
  // normalize the value for what's expected in Next.js

  if (!language || language === '') {
    settings.language = 'en-US';
  } else {
    settings.language = language.replace('_', '-');
  }

  settings.title = decodeHtmlEntities(settings.title);

  return settings;
}
