import { gql, useQuery, NetworkStatus } from '@apollo/client';
import { initializeApollo } from 'lib/apollo-client';

const GET_ALL_SLUGS = gql`
  {
    posts(first: 10000) {
      edges {
        node {
          slug
        }
      }
    }
  }
`;

export async function getPostSlugs() {
  const apolloClient = initializeApollo();

  return await apolloClient.query({ query: GET_ALL_SLUGS });
}

const POST_BY_SLUG = (slug) => gql`
query MyQuery {
  postBy(slug: "${slug}"){
    author {
      node {
        name
      }
    }
    content
    date
    uri
    title
  }
}
`;

export async function getPostBySlug(slug) {
  console.log(slug);
  const apolloClient = initializeApollo();
  console.log('postbyslug', POST_BY_SLUG(slug));
  return await apolloClient.query({ query: POST_BY_SLUG(slug) });
}
