export const POST_FIELDS = `
  fragment PostFields on Post {
    id
    categories {
      edges {
        node {
          databaseId
          id
          name
          slug
          __typename
        }
        __typename
      }
      __typename
    }
    databaseId
    date
    isSticky
    postId
    slug
    title
    __typename
  }
`;

export const QUERY_ALL_POSTS_INDEX = `
  ${POST_FIELDS}
  query AllPostsIndex {
    posts(first: 10000, where: {hasPassword: false}) {
      edges {
        node {
          ...PostFields
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_ALL_POSTS_ARCHIVE = `
  ${POST_FIELDS}
  query AllPostsArchive {
    posts(first: 10000, where: {hasPassword: false}) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
                __typename
              }
              id
              name
              slug
              __typename
            }
            __typename
          }
          excerpt
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_ALL_POSTS = `
  ${POST_FIELDS}
  query AllPosts {
    posts(first: 10000, where: {hasPassword: false}) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
                __typename
              }
              id
              name
              slug
              __typename
            }
            __typename
          }
          content
          excerpt
          featuredImage {
            node {
              altText
              caption
              sourceUrl
              srcSet
              sizes
              id
              __typename
            }
            __typename
          }
          modified
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_POST_BY_SLUG = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      author {
        node {
          avatar {
            height
            url
            width
            __typename
          }
          id
          name
          slug
          __typename
        }
        __typename
      }
      id
      categories {
        edges {
          node {
            databaseId
            id
            name
            slug
            __typename
          }
          __typename
        }
        __typename
      }
      content
      date
      excerpt
      featuredImage {
        node {
          altText
          caption
          sourceUrl
          srcSet
          sizes
          id
          __typename
        }
        __typename
      }
      modified
      databaseId
      title
      slug
      isSticky
      __typename
    }
  }
`;

export const QUERY_POSTS_BY_CATEGORY_ID_INDEX = `
  ${POST_FIELDS}
  query PostsByCategoryId($categoryId: Int!) {
    posts(where: {categoryId: $categoryId, hasPassword: false}) {
      edges {
        node {
          ...PostFields
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_POSTS_BY_CATEGORY_ID_ARCHIVE = `
  ${POST_FIELDS}
  query PostsByCategoryId($categoryId: Int!) {
    posts(where: {categoryId: $categoryId, hasPassword: false}) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
                __typename
              }
              id
              name
              slug
              __typename
            }
            __typename
          }
          excerpt
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_POSTS_BY_CATEGORY_ID = `
  ${POST_FIELDS}
  query PostsByCategoryId($categoryId: Int!) {
    posts(where: {categoryId: $categoryId, hasPassword: false}) {
      edges {
        node {
          ...PostFields
          author {
            node {
              avatar {
                height
                url
                width
                __typename
              }
              id
              name
              slug
              __typename
            }
            __typename
          }
          content
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              sizes
              sourceUrl
              srcSet
              __typename
            }
            __typename
          }
          modified
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_POSTS_BY_AUTHOR_SLUG_INDEX = `
  ${POST_FIELDS}
  query PostByAuthorSlugIndex($slug: String!) {
    posts(where: {authorName: $slug, hasPassword: false}) {
      edges {
        node {
          ...PostFields
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_POSTS_BY_AUTHOR_SLUG_ARCHIVE = `
  ${POST_FIELDS}
  query PostByAuthorSlugArchive($slug: String!) {
    posts(where: {authorName: $slug, hasPassword: false}) {
      edges {
        node {
          ...PostFields
          excerpt
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_POSTS_BY_AUTHOR_SLUG = `
  ${POST_FIELDS}
  query PostByAuthorSlug($slug: String!) {
    posts(where: {authorName: $slug, hasPassword: false}) {
      edges {
        node {
          ...PostFields
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              sizes
              sourceUrl
              srcSet
              __typename
            }
            __typename
          }
          modified
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_POST_SEO_BY_SLUG = `
  query PostSEOBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      seo {
        canonical
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphModifiedTime
        opengraphPublishedTime
        opengraphPublisher
        opengraphTitle
        opengraphType
        readingTime
        title
        twitterDescription
        twitterTitle
        twitterImage {
          altText
          sourceUrl
          mediaDetails {
            width
            height
            __typename
          }
          __typename
        }
        opengraphImage {
          altText
          sourceUrl
          mediaDetails {
            height
            width
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

export const QUERY_POST_PER_PAGE = `
  query PostPerPage {
    allSettings {
      readingSettingsPostsPerPage
      __typename
    }
  }
`;
