import 'styles/globals.scss';

import SiteContext from 'context/site-context';

import { getSiteMetadata } from 'lib/site';

function App({ Component, pageProps, siteMetadata }) {
  return (
    <SiteContext.Provider value={{ metadata: siteMetadata }}>
      <Component {...pageProps} />
    </SiteContext.Provider>
  );
}

App.getInitialProps = async function () {
  return {
    siteMetadata: await getSiteMetadata()
  }
}

export default App;