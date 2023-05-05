import { gql } from '@apollo/client';

import { getApolloClient } from '@/lib/apollo-client';

/**
 * getNodeByUri
 */

export async function getNodeByUri(uri) {
  const apolloClient = await getApolloClient();

  const data = await apolloClient.query({
    query: gql`
      query GetNode($uri: String!) {
        nodeByUri(uri: $uri) {
          __typename
          id
          isContentNode
          isTermNode
          uri
          ...Category
          ...ContentType
          ...Page
          ...Post
          ...User
        }
      }
      fragment Page on Page {
        id
        isContentNode
        isFrontPage
        isPostsPage
        isPreview
        isPrivacyPage
        isRestricted
        isRevision
        isTermNode
        title
      }
      fragment ContentType on ContentType {
        id
        isContentNode
        isFrontPage
        isPostsPage
        isRestricted
        isTermNode
        name
      }
      fragment Category on Category {
        id
        isContentNode
        isRestricted
        isTermNode
        name
      }
      fragment User on User {
        id
        email
        isContentNode
        isRestricted
        isTermNode
        name
      }
      fragment Post on Post {
        id
        isContentNode
        isPreview
        isRestricted
        isRevision
        isSticky
        isTermNode
        title
      }
    `,
    variables: {
      uri,
    },
    possibleTypes: {
      Node: ['Category', 'ContentType', 'Page', 'Post', 'User'],
    },
  });

  return data.data.nodeByUri;
}

/**
 * getTemplateDataByNode
 */

export async function getTemplateDataByNode({ node, template }) {
  const apolloClient = await getApolloClient();
  return apolloClient.query({
    query: template.query,
    variables: template.variables(node),
  });
}

