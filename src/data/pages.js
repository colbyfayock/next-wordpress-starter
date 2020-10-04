import { gql } from '@apollo/client';

export const QUERY_ALL_PAGES = gql`
  {
    pages(first: 10000) {
      edges {
        node {
          content
          id
          menuOrder
          slug
          title
        }
      }
    }
  }
`;

export function getQueryPageById(id) {
  return gql`
    query {
      page(id: "${id}") {
        title
        slug
        menuOrder
        content
      }
    }
  `;
}
