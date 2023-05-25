export const QUERY_ALL_CATEGORIES = `
  query AllCategories {
    categories(first: 10000) {
      edges {
        node {
          databaseId
          description
          id
          name
          uri
        }
      }
    }
  }
`;
