import 'styles/globals.scss';

import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'lib/apolloClient';
import SiteContext from 'context/site-context';
import { getSiteMetadata } from 'lib/site';
import { getAllPosts } from 'lib/posts';
import { getNavigationPages } from 'lib/pages';

function App({ Component, pageProps = {}, metadata, navigation }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  const context = {
    metadata,
    navigation,
  };

  return (
    <ApolloProvider client={apolloClient}>
      <SiteContext.Provider value={context}>
        <Component {...pageProps} />
      </SiteContext.Provider>
    </ApolloProvider>
  );
}

App.getInitialProps = async function () {
  return {
    metadata: await getSiteMetadata(),
    navigation: await getNavigationPages(),
  };
};

export default App;
