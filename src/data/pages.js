export const PAGE_FIELDS = `
  fragment PageFields on Page {
    children {
      edges {
        node {
          id
          slug
          uri
          ... on Page {
            id
            title
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    id
    menuOrder
    parent {
      node {
        id
        slug
        uri
        ... on Page {
          title
          __typename
        }
        __typename
      }
      __typename
    }
    slug
    title
    uri
    __typename
  }
`;

export const QUERY_ALL_PAGES_INDEX = `
  ${PAGE_FIELDS}
  query AllPagesIndex {
    pages(first: 10000, where: {hasPassword: false}) {
      edges {
        node {
          ...PageFields
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_ALL_PAGES_ARCHIVE = QUERY_ALL_PAGES_INDEX;

export const QUERY_ALL_PAGES = `
  ${PAGE_FIELDS}
  query AllPagesIndex {
    pages(first: 10000, where: {hasPassword: false}) {
      edges {
        node {
          ...PageFields
          content
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
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const QUERY_PAGE_BY_URI = `
  query PageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      children {
        edges {
          node {
            id
            slug
            uri
            ... on Page {
              id
              title
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      content
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
      id
      menuOrder
      parent {
        node {
          id
          slug
          uri
          ... on Page {
            title
            __typename
          }
          __typename
        }
        __typename
      }
      slug
      title
      uri
      __typename
    }
  }
`;

export const QUERY_PAGE_SEO_BY_URI = `
  query PageSEOByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
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
