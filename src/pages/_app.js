import { ApolloProvider } from '@apollo/client';

import { SiteContext, useSiteContext } from 'hooks/use-site';

import { getSiteMetadata } from 'lib/site';
import { getRecentPosts } from 'lib/posts';
import { getTopLevelPages } from 'lib/pages';
import { getCategories } from 'lib/categories';
import { getAllMenus, createMenuFromPages, MENU_LOCATION_NAVIGATION_DEFAULT } from 'lib/menus';
import useApolloClient from 'hooks/use-apollo-client';

import 'styles/globals.scss';

function App({ Component, pageProps = {}, metadata, recentPosts, categories, menus }) {
  const apolloClient = useApolloClient(pageProps.initialApolloState);

  const site = useSiteContext({
    metadata,
    recentPosts,
    categories,
    menus,
  });

  return (
    <ApolloProvider client={apolloClient}>
      <SiteContext.Provider value={site}>
        <Component {...pageProps} />
      </SiteContext.Provider>
    </ApolloProvider>
  );
}

App.getInitialProps = async function () {
  const { posts: recentPosts } = await getRecentPosts({
    count: 5,
  });

  const { categories } = await getCategories({
    count: 5,
  });

  const { menus } = await getAllMenus();

  const defaultNavigation = createMenuFromPages({
    locations: [MENU_LOCATION_NAVIGATION_DEFAULT],
    pages: await getTopLevelPages(),
  });

  menus.push(defaultNavigation);

  return {
    metadata: await getSiteMetadata(),
    recentPosts,
    categories,
    menus,
  };
};

export default App;
