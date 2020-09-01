import 'styles/globals.scss';

import SiteContext from 'context/site-context';
import { getSiteMetadata } from 'lib/site';
import { getAllPosts } from 'lib/posts';

function App({ Component, pageProps, siteMetadata }) {
  const context = {
    metadata: siteMetadata
  }
  return (
    <SiteContext.Provider value={context}>
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