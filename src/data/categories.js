import { gql } from '@apollo/client';

export const QUERY_ALL_CATEGORIES = gql`
  {
    categories(first: 10000) {
      edges {
        node {
          categoryId
          description
          id
          name
          slug
        }
      }
    }
  }
`;

export const QUERY_CATEGORY_BY_SLUG = gql`
  query CategoryBySlug($slug: [String]) {
    categories(where: { slug: $slug }, first: 10000) {
      edges {
        node {
          categoryId
          description
          id
          name
          slug
        }
      }
    }
  }
`;

export const QUERY_CATEGORY_SEO_BY_SLUG = gql`
  query CategorySEOBySlug($slug: [String]) {
    categories(where: { slug: $slug }, first: 10000) {
      edges {
        node {
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
    }
  }
`;
