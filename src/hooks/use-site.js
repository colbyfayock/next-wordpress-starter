import path from 'path';
import { useContext, createContext } from 'react';
import { useRouter } from 'next/router';

import config from '../../package.json';

export const SiteContext = createContext();

/**
 * useSiteContext
 */

export function useSiteContext(data) {
  const { homepage = '' } = config;
  return {
    ...data,
    homepage,
  };
}

/**
 * useSite
 */

export function useSite() {
  const site = useContext(SiteContext);
  return site;
}

/**
 * useHelmetSettings
 */

export function usePageMetadata({ metadata: pageMetadata }) {
  const { homepage, metadata: defaultMetadata, ...rest } = useContext(SiteContext);

  const router = useRouter();

  const metadata = constructPageMetadata(defaultMetadata, pageMetadata, {
    homepage,
    router,
  });

  return {
    metadata,
  };
}

/**
 * constructHelmetData
 */

function constructPageMetadata(defaultMetadata = {}, pageMetadata = {}, options = {}) {
  const { router = {}, homepage = '' } = options;
  const { asPath } = router;

  const url = path.join(homepage, asPath);
  const pathname = new URL(url).pathname;
  const canonical = pageMetadata.canonical || path.join(homepage, pathname);

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

  const ogProperties = ['description', 'title', 'type'];

  ogProperties.forEach((property) => {
    const pageOg = pageMetadata.og?.[property];
    const pageStatic = pageMetadata[property];
    const defaultOg = defaultMetadata.og?.[property];
    const defaultStatic = defaultMetadata[property];
    const value = pageOg || pageStatic || defaultOg || defaultStatic;

    if (typeof value === 'undefined') return;

    metadata.og[property] = value;
  });

  // Twitter Properties
  // Loop through Twitter properties that rely on a non-object value

  const twitterProperties = ['description', 'title'];

  twitterProperties.forEach((property) => {
    const pageTwitter = pageMetadata.twitter?.[property];
    const pageOg = metadata.og[property];
    const value = pageTwitter || pageOg;

    if (typeof value === 'undefined') return;

    metadata.twitter[property] = value;
  });

  return metadata;
}

export function helmetSettingsFromMetadata(metadata = {}) {
  const settings = {
    title: metadata.title,
    htmlAttributes: {
      lang: metadata.language,
    },
    link: [
      {
        rel: 'canonical',
        href: metadata.canonical,
      },
    ],
    meta: [
      {
        name: 'description',
        content: metadata.description,
      },
      {
        name: 'og:title',
        content: metadata.og.title,
      },
      {
        name: 'og:description',
        content: metadata.og.description,
      },
      {
        name: 'og:url',
        content: metadata.og.url,
      },
      {
        name: 'og:type',
        content: metadata.og.type,
      },
      {
        name: 'twitter:title',
        content: metadata.twitter.title,
      },
      {
        name: 'twitter:description',
        content: metadata.twitter.description,
      },
      {
        name: 'article:modified_time',
        content: metadata.og.modifiedTime,
      },
      {
        name: 'article:published_time',
        content: metadata.og.publishedTime,
      },
    ],
  };

  return settings;
}
