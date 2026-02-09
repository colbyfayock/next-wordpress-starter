export const QUERY_ALL_TAGS = `
  query AllTags {
    tags(first: 10000) {
      edges {
        node {
          databaseId
          description
          id
          name
          slug
          uri
        }
      }
    }
  }
`;
