import { ApolloProvider } from '@apollo/client';

import SiteContext from 'context/site-context';
import { getSiteMetadata } from 'lib/site';
import { getAllPosts } from 'lib/posts';
import { getNavigationPages } from 'lib/pages';
import useApolloClient from 'hooks/use-apollo-client';

import 'styles/globals.scss';

function App({ Component, pageProps = {}, metadata, navigation }) {
  const apolloClient = useApolloClient(pageProps.initialApolloState);

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
