import { getApolloClient } from 'lib/apollo-client';

import { decodeHtmlEntities, removeExtraSpaces } from 'lib/util';

import { QUERY_SITE_DATA, QUERY_SEO_DATA } from 'data/site';

/**
 * getSiteMetadata
 */

export async function getSiteMetadata() {
  const apolloClient = getApolloClient();

  let siteData;
  let seoData;

  try {
    siteData = await apolloClient.query({
      query: QUERY_SITE_DATA,
    });
  } catch (e) {
    console.log(`[site][getSiteMetadata] Failed to query site data: ${e.message}`);
    throw e;
  }

  const { generalSettings } = siteData?.data || {};
  let { title, description, language } = generalSettings;

  const settings = {
    title,
    siteTitle: title,
    description,
  };

  // It looks like the value of `language` when US English is set
  // in WordPress is empty or "", meaning, we have to infer that
  // if there's no value, it's English. On the other hand, if there
  // is a code, we need to grab the 2char version of it to use ofr
  // the HTML lang attribute

  if (!language || language === '') {
    settings.language = 'en';
  } else {
    settings.language = language.split('_')[0];
  }

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

  if (process.env.WORDPRESS_PLUGIN_SEO === true) {
    try {
      seoData = await apolloClient.query({
        query: QUERY_SEO_DATA,
      });
    } catch (e) {
      console.log(`[site][getSiteMetadata] Failed to query SEO plugin: ${e.message}`);
      console.log('Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.');
      throw e;
    }

    const { webmaster, social } = seoData?.data?.seo || {};

    if (social) {
      settings.social = {};

      Object.keys(social).forEach((key) => {
        const { url } = social[key];
        if (!url || key === '__typename') return;
        settings.social[key] = url;
      });
    }

    if (webmaster) {
      settings.webmaster = {};

      Object.keys(webmaster).forEach((key) => {
        if (!webmaster[key] || key === '__typename') return;
        settings.webmaster[key] = webmaster[key];
      });
    }

    if (social.twitter) {
      settings.twitter = {
        username: social.twitter.username,
        cardType: social.twitter.cardType,
      };

      settings.social.twitter = {
        url: `https://twitter.com/${settings.twitter.username}`,
      };
    }
  }

  settings.title = decodeHtmlEntities(settings.title);

  return settings;
}

/**
 * constructHelmetData
 */

export function constructPageMetadata(defaultMetadata = {}, pageMetadata = {}, options = {}) {
  const { router = {}, homepage = '' } = options;
  const { asPath } = router;

  const url = `${homepage}${asPath}`;
  const pathname = new URL(url).pathname;
  const canonical = pageMetadata.canonical || `${homepage}${pathname}`;

  const metadata = {
    canonical,
    og: {
      url,
    },
    twitter: {},
  };

  // Static Properties
  // Loop through top level metadata properties that rely on a non-object value

  const staticProperties = ['description', 'language', 'title'];

  staticProperties.forEach((property) => {
    const value = typeof pageMetadata[property] !== 'undefined' ? pageMetadata[property] : defaultMetadata[property];

    if (typeof value === 'undefined') return;

    metadata[property] = value;
  });

  // Open Graph Properties
  // Loop through Open Graph properties that rely on a non-object value

  if (pageMetadata.og) {
    const ogProperties = ['description', 'imageUrl', 'imageHeight', 'imageSecureUrl', 'imageWidth', 'title', 'type'];

    ogProperties.forEach((property) => {
      const pageOg = pageMetadata.og?.[property];
      const pageStatic = pageMetadata[property];
      const defaultOg = defaultMetadata.og?.[property];
      const defaultStatic = defaultMetadata[property];
      const value = pageOg || pageStatic || defaultOg || defaultStatic;

      if (typeof value === 'undefined') return;

      metadata.og[property] = value;
    });
  }

  // Twitter Properties
  // Loop through Twitter properties that rely on a non-object value

  if (pageMetadata.twitter) {
    const twitterProperties = ['cardType', 'description', 'imageUrl', 'title', 'username'];

    twitterProperties.forEach((property) => {
      const pageTwitter = pageMetadata.twitter?.[property];
      const pageOg = metadata.og[property];
      const value = pageTwitter || pageOg;

      if (typeof value === 'undefined') return;

      metadata.twitter[property] = value;
    });
  }

  // Article Properties
  // Loop through article properties that rely on a non-object value

  if (metadata.og.type === 'article' && pageMetadata.article) {
    metadata.article = {};

    const articleProperties = ['author', 'modifiedTime', 'publishedTime', 'publisher'];

    articleProperties.forEach((property) => {
      const value = pageMetadata.article[property];

      if (typeof value === 'undefined') return;

      metadata.article[property] = value;
    });
  }

  return metadata;
}

/**
 * helmetSettingsFromMetadata
 */

export function helmetSettingsFromMetadata(metadata = {}, options = {}) {
  const { link = [], meta = [], setTitle = true } = options;

  const sanitizedDescription = removeExtraSpaces(metadata.description);

  const settings = {
    htmlAttributes: {
      lang: metadata.language,
    },
  };

  if (setTitle) {
    settings.title = metadata.title;
  }

  settings.link = [
    ...link,
    {
      rel: 'canonical',
      href: metadata.canonical,
    },
  ].filter(({ href } = {}) => !!href);

  settings.meta = [
    ...meta,
    {
      name: 'description',
      content: sanitizedDescription,
    },
    {
      property: 'og:title',
      content: metadata.og?.title || metadata.title,
    },
    {
      property: 'og:description',
      content: metadata.og?.description || sanitizedDescription,
    },
    {
      property: 'og:url',
      content: metadata.og?.url,
    },
    {
      property: 'og:image',
      content: metadata.og?.imageUrl,
    },
    {
      property: 'og:image:secure_url',
      content: metadata.og?.imageSecureUrl,
    },
    {
      property: 'og:image:width',
      content: metadata.og?.imageWidth,
    },
    {
      property: 'og:image:height',
      content: metadata.og?.imageHeight,
    },
    {
      property: 'og:type',
      content: metadata.og?.type || 'website',
    },
    {
      property: 'og:site_name',
      content: metadata.siteTitle,
    },
    {
      property: 'twitter:title',
      content: metadata.twitter?.title || metadata.og?.title || metadata.title,
    },
    {
      property: 'twitter:description',
      content: metadata.twitter?.description || metadata.og?.description || sanitizedDescription,
    },
    {
      property: 'twitter:image',
      content: metadata.twitter?.imageUrl || metadata.og?.imageUrl,
    },
    {
      property: 'twitter:site',
      content: metadata.twitter?.username && `@${metadata.twitter.username}`,
    },
    {
      property: 'twitter:card',
      content: metadata.twitter?.cardType,
    },
    {
      property: 'article:modified_time',
      content: metadata.article?.modifiedTime,
    },
    {
      property: 'article:published_time',
      content: metadata.article?.publishedTime,
    },
  ].filter(({ content } = {}) => !!content);

  return settings;
}
