export const POST_FIELDS = `
  fragment PostFields on Post {
    id
    categories {
      edges {
        node {
          databaseId
          id
          name
          uri
        }
      }
    }
    date
    isSticky
    modified
    postId
    title
    uri
  }
`;

export const QUERY_ALL_POSTS_INDEX = `
  ${POST_FIELDS}
  query AllPostsIndex {
    posts(first: 10000, where: { hasPassword: false }) {
      edges {
        node {
          ...PostFields
        }
      }
    }
  }
`;

export const QUERY_ALL_POSTS_ARCHIVE = `
  ${POST_FIELDS}
  query AllPostsArchive {
    posts(first: 10000, where: { hasPassword: false }) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              uri
            }
          }
          excerpt
        }
      }
    }
  }
`;

export const QUERY_ALL_POSTS = `
  ${POST_FIELDS}
  query AllPosts {
    posts(first: 10000, where: { hasPassword: false }) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              uri
            }
          }
          content
          excerpt
          featuredImage {
            node {
              altText
              caption
              mediaDetails {
                height
                width
              }
              sourceUrl
              srcSet
              sizes
              id
            }
          }
          modified
        }
      }
    }
  }
`;

export const QUERY_POSTS_BY_CATEGORY_ID_INDEX = `
  ${POST_FIELDS}
  query PostsByCategoryId($categoryId: Int!) {
    posts(where: { categoryId: $categoryId, hasPassword: false }) {
      edges {
        node {
          ...PostFields
        }
      }
    }
  }
`;

export const QUERY_POSTS_BY_CATEGORY_ID_ARCHIVE = `
  ${POST_FIELDS}
  query PostsByCategoryId($categoryId: Int!) {
    posts(where: { categoryId: $categoryId, hasPassword: false }) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              uri
            }
          }
          excerpt
        }
      }
    }
  }
`;

export const QUERY_POSTS_BY_CATEGORY_ID = `
  ${POST_FIELDS}
  query PostsByCategoryId($categoryId: Int!) {
    posts(where: { categoryId: $categoryId, hasPassword: false }) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              uri
            }
          }
          content
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              mediaDetails {
                height
                width
              }
              sizes
              sourceUrl
              srcSet
            }
          }
          modified
        }
      }
    }
  }
`;

export const QUERY_POST_PER_PAGE = `
  query PostPerPage {
    allSettings {
      readingSettingsPostsPerPage
    }
  }
`;
