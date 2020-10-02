import path from 'path';
import { useContext } from 'react';

import SiteContext from 'context/site-context';

import config from '../../package.json';

export default function useSite() {
  const { homepage = '' } = config;

  const site = useContext(SiteContext);

  return {
    ...site,
    homepage,
  };
}
