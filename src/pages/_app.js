import 'styles/globals.scss';

import SiteContext from 'context/site-context';
import { getSiteMetadata } from 'lib/site';
import { getAllPosts } from 'lib/posts';

import searchIndex from 'data/search.json';

function App({ Component, pageProps, siteMetadata, searchIndex }) {
  const context = {
    metadata: siteMetadata,
    searchIndex
  }
  return (
    <SiteContext.Provider value={context}>
      <Component {...pageProps} />
    </SiteContext.Provider>
  );
}

App.getInitialProps = async function () {
  const { posts } = await getAllPosts({
    query: {
      _fields: 'id,slug,title,date'
    }
  });

  return {
    siteMetadata: await getSiteMetadata(),
    searchIndex: posts
  }
}

export default App;