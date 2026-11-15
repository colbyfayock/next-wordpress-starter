export const QUERY_ALL_MENUS = `
  query AllMenus {
    menus {
      edges {
        node {
          id
          menuItems {
            edges {
              node {
                cssClasses
                id
                parentId
                label
                title
                target
                path
                __typename
              }
              __typename
            }
            __typename
          }
          name
          slug
          locations
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
