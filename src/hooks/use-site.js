import { useContext } from 'react';

import SiteContext from 'context/site-context';

export default function useSite() {
  return useContext(SiteContext);
}