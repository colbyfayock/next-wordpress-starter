import 'styles/globals.scss';

import SiteContext from 'context/site-context';

import { getSiteMetadata } from 'lib/site';

function MyApp({ Component, pageProps, siteMetadata }) {
  return (
    <SiteContext.Provider value={{ metadata: siteMetadata }}>
      <Component {...pageProps} />
    </SiteContext.Provider>
  );
}

MyApp.getInitialProps = async function () {
  return {
    siteMetadata: await getSiteMetadata()
  }
}

export default MyApp;