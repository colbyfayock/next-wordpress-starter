import { gql } from '@/lib/request';

/**
 * getNodeByUri
 */

export async function getNodeByUri(uri) {
  const data = await gql({
    query: `
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
  });

  return data.data.nodeByUri;
}

/**
 * getTemplateDataByNode
 */

export async function getTemplateDataByNode({ node, template }) {
  return gql({
    query: template.query,
    variables: template.variables(node),
  });
}
