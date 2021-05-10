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
<<<<<<< HEAD
                parentId
=======
>>>>>>> 4192908c3dabf341ad5bd230f46409ce870aa385
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
