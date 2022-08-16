import { gql } from '@apollo/client';
import { getApolloClient } from 'lib/apollo-client';

import Page from 'templates/page';

const templates = {
  Page,
};

export default function Node(props) {
  const { data } = props;
  const Component = templates[data.__typename] || templates.Page;
  return <Component {...props} />;
}

export async function getStaticProps({ params = {} } = {}) {
  let resolvedUrl = null;

  if (params?.uriNodes) {
    resolvedUrl = params.uriNodes.join('/');
  }

  if (!resolvedUrl) {
    return {
      notFound: true,
    };
  }

  const apolloClient = await getApolloClient();

  const metaData = await apolloClient.query({
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
      uri: resolvedUrl,
    },
    possibleTypes: {
      Node: ['Category', 'ContentType', 'Page', 'Post', 'User'],
    },
  });

  const node = metaData.data.nodeByUri;

  if (!node || node.isRestricted) {
    return {
      notFound: true,
    };
  }

  const { template } = templates[node.__typename] || templates.Page;

  const nodeData = await apolloClient.query({
    query: template.query,
    variables: template.variables(node),
  });

  const data = typeof template.transformer === 'function' ? template.transformer(nodeData?.data) : nodeData?.data;

  const breadcrumbs = Array.isArray(data.ancestors) ? [...data.ancestors] : [];
  breadcrumbs.reverse();

  return {
    props: {
      data,
      breadcrumbs,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
