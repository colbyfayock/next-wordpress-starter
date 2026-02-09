export const QUERY_ALL_USERS = `
  query AllUsers {
    users(first: 10000) {
      edges {
        node {
          id
          name
          uri
        }
      }
    }
  }
`;
