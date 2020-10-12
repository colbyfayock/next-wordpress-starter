import { gql } from '@apollo/client';

export const QUERY_ALL_CATEGORIES = gql`
  {
    categories(first: 10000) {
      edges {
        node {
          categoryId
          description
          id
          name
          slug
        }
      }
    }
  }
`;

export function getQueryCategoryBySlug(slug) {
  return gql`
    query {
      categories(where: { slug: "${slug}" }, first: 10000) {
        edges {
          node {
            categoryId
            description
            id
            name
            slug
          }
        }
      }
    }
  `;
}
