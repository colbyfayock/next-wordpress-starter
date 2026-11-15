export const QUERY_ALL_CATEGORIES = `
  query AllCategories {
    categories(first: 10000) {
      edges {
        node {
          databaseId
          description
          id
          name
          slug
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_CATEGORY_BY_SLUG = `
  query CategoryBySlug($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      databaseId
      description
      id
      name
      slug
      __typename
    }
  }
`;

export const QUERY_CATEGORY_SEO_BY_SLUG = `
  query CategorySEOBySlug($slug: ID!) {
    category(id: $slug, idType: SLUG) {
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
