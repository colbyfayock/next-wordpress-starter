export const PAGE_FIELDS = `
  fragment PageFields on Page {
    children {
      edges {
        node {
          id
          uri
          ... on Page {
            id
            title
          }
        }
      }
    }
    id
    menuOrder
    modified
    parent {
      node {
        id
        uri
        ... on Page {
          title
        }
      }
    }
    title
    uri
  }
`;

export const QUERY_ALL_PAGES_INDEX = `
  ${PAGE_FIELDS}
  query AllPagesIndex {
    pages(first: 10000, where: { hasPassword: false }) {
      edges {
        node {
          ...PageFields
        }
      }
    }
  }
`;

export const QUERY_ALL_PAGES_ARCHIVE = `
  ${PAGE_FIELDS}
  query AllPagesIndex {
    pages(first: 10000, where: { hasPassword: false }) {
      edges {
        node {
          ...PageFields
        }
      }
    }
  }
`;

export const QUERY_ALL_PAGES = `
  ${PAGE_FIELDS}
  query AllPagesIndex {
    pages(first: 10000, where: { hasPassword: false }) {
      edges {
        node {
          ...PageFields
          content
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
        }
      }
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
            uri
            ... on Page {
              id
              title
            }
          }
        }
      }
      content
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
      id
      menuOrder
      parent {
        node {
          id
          uri
          ... on Page {
            title
          }
        }
      }
      title
      uri
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
          }
        }
        opengraphImage {
          altText
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
    }
  }
`;
