import 'styles/globals.scss';

import SiteContext from 'context/site-context';
import { getSiteMetadata } from 'lib/site';
import { getAllPosts } from 'lib/posts';
import { getNavigationPages } from 'lib/pages';

function App({ Component, pageProps, metadata, navigation }) {
  const context = {
    metadata,
    navigation,
  };
  return (
    <SiteContext.Provider value={context}>
      <Component {...pageProps} />
    </SiteContext.Provider>
  );
}

App.getInitialProps = async function () {
  return {
    metadata: await getSiteMetadata(),
    navigation: await getNavigationPages(),
  };
};

export default App;
