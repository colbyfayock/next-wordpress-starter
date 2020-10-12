import { gql } from '@apollo/client';

export const QUERY_ALL_POSTS = gql`
  {
    posts(first: 10000) {
      edges {
        node {
          id
          title
          date
          content
          excerpt
          modified
          postId
          slug
        }
      }
    }
  }
`;

export function getQueryPostBySlug(slug) {
  return gql`
    query {
      postBy(slug: "${slug}"){
        id
        title
        date
        content
        excerpt
        modified
        postId
        slug
      }
    }
  `;
}
