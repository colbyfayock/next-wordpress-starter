import NextApp from 'next/app';

import { SiteContext, useSiteContext } from '@/hooks/use-site';
import { SearchProvider } from 'hooks/use-search';

import { getSiteMetadata } from '@/lib/site';
import { getRecentPosts } from '@/lib/posts';
import { getCategories } from '@/lib/categories';

import 'styles/globals.scss';
import 'styles/wordpress.scss';

function App({ Component, pageProps = {}, metadata, recentPosts, categories }) {
  const site = useSiteContext({
    metadata,
    recentPosts,
    categories,
    menus,
  });

  return (
    <SiteContext.Provider value={site}>
      <SearchProvider>
        <Component {...pageProps} />
      </SearchProvider>
    </SiteContext.Provider>
  );
}

App.getInitialProps = async function (appContext) {
  const appProps = await NextApp.getInitialProps(appContext);

  const { posts: recentPosts } = await getRecentPosts({
    count: 5,
    queryIncludes: 'index',
  });

  const { categories } = await getCategories({
    count: 5,
  });


  return {
    ...appProps,
    metadata: await getSiteMetadata(),
    recentPosts,
    categories,
  };
};

export default App;
