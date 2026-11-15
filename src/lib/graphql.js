import { createGraphQLClient } from './graphql-client.js';

let client;

export function getGraphQLClient() {
  if (!client) {
    client = createGraphQLClient(process.env.WORDPRESS_GRAPHQL_ENDPOINT);
  }
  return client;
}
