import { gql } from '@apollo/client';

export const QUERY_ALL_USERS = gql`
  {
    users(first: 10000) {
      edges {
        node {
          id
          roles {
            nodes {
              name
            }
          }
          name
          slug
        }
      }
    }
  }
`;
