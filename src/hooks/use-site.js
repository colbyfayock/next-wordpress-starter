import path from 'path';
import { useContext, createContext } from 'react';

import config from '../../package.json';

export const SiteContext = createContext();

/**
 * useSiteContext
 */

export function useSiteContext({ metadata: pageMetadata, ...rest }) {
  const { homepage = '' } = config;

  const { title, description } = pageMetadata;

  const metadata = {
    ...pageMetadata,
  };

  return {
    ...rest,
    homepage,
    metadata,
  };
}

/**
 * useSite
 */

export function useSite() {
  const site = useContext(SiteContext);
  return site;
}
