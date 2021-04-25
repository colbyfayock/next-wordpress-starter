import path from 'path';
import { useContext, createContext } from 'react';
import { useRouter } from 'next/router';

import config from '../../package.json';

import { constructPageMetadata } from 'lib/site';
import { removeLastTrailingSlash } from 'lib/util';

export const SiteContext = createContext();

/**
 * useSiteContext
 */

export function useSiteContext(data) {
  let { homepage = '' } = config;

  // Trim the trailing slash from the end of homepage to avoid
  // double // issues throughout the metadata

  homepage = removeLastTrailingSlash(homepage);

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
