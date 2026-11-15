export const QUERY_ALL_USERS = `
  query AllUsers {
    users(first: 10000) {
      edges {
        node {
          avatar {
            height
            width
            url
            __typename
          }
          description
          id
          name
          roles {
            nodes {
              name
              __typename
            }
            __typename
          }
          slug
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_ALL_USERS_SEO = `
  query AllUsersSeo {
    users(first: 10000) {
      edges {
        node {
          id
          seo {
            metaDesc
            metaRobotsNofollow
            metaRobotsNoindex
            title
            social {
              youTube
              wikipedia
              twitter
              soundCloud
              pinterest
              mySpace
              linkedIn
              instagram
              facebook
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
