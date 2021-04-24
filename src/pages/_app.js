import { ApolloProvider } from '@apollo/client';

import { SiteContext, useSiteContext } from 'hooks/use-site';

import { getSiteMetadata } from 'lib/site';
import { getRecentPosts } from 'lib/posts';
import { getNavigationPages } from 'lib/pages';
import { getCategories } from 'lib/categories';
import useApolloClient from 'hooks/use-apollo-client';

import 'styles/globals.scss';

function App({ Component, pageProps = {}, metadata, navigation, recentPosts, categories }) {
  const apolloClient = useApolloClient(pageProps.initialApolloState);
  console.log('metadata', metadata);
  const site = useSiteContext({
    metadata,
    navigation,
    recentPosts,
    categories,
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

  return {
    metadata: await getSiteMetadata(),
    navigation: await getNavigationPages(),
    recentPosts,
    categories,
  };
};

export default App;
