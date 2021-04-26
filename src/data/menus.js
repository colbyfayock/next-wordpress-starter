import { gql } from '@apollo/client';

export const QUERY_ALL_MENUS = gql`
  {
    menus {
      edges {
        node {
          id
          menuId
          menuItems {
            edges {
              node {
                cssClasses
                id
                label
                title
                target
                path
              }
            }
          }
          name
          slug
          locations
        }
      }
    }
  }
`;
