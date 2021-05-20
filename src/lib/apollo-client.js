import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { concatPagination } from '@apollo/client/utilities';

import { removeLastTrailingSlash } from 'lib/util';

let apolloClient;

const WORDPRESS_HOST = removeLastTrailingSlash(process.env.WORDPRESS_HOST);
const WORDPRESS_GRAPHQL_ENDPOINT = removeLastTrailingSlash(process.env.WORDPRESS_GRAPHQL_ENDPOINT);

const DEFAULT_GRAPHQL_PATH = '/graphql';
const GRAPHQL_ENDPOINT = WORDPRESS_GRAPHQL_ENDPOINT || `${WORDPRESS_HOST}${DEFAULT_GRAPHQL_PATH}`;

let client;

/**
 * getApolloClient
 */

export function getApolloClient() {
  if (!client) {
    client = _createApolloClient();
  }
  return client;
}

/**
 * createApolloClient
 */

export function _createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
    }),
    cache: new InMemoryCache(),
  });
}
