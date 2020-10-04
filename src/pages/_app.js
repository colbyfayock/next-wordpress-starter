import 'styles/globals.scss';

import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'lib/apolloClient';
import SiteContext from 'context/site-context';
import { getSiteMetadata } from 'lib/site';
import { getAllPosts } from 'lib/posts';

function App({ Component, pageProps = {}, siteMetadata }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const context = {
    metadata: siteMetadata,
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
    siteMetadata: await getSiteMetadata(),
  };
};

export default App;
