import { gql } from '@apollo/client';

export const QUERY_ALL_PAGES = gql`
  {
    pages(first: 10000) {
      edges {
        node {
          children {
            edges {
              node {
                id
                slug
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
              slug
              uri
              ... on Page {
                title
              }
            }
          }
          slug
          title
          uri
        }
      }
    }
  }
`;

export const QUERY_PAGE_BY_URI = gql`
  query Page($uri: String!) {
    pageBy(uri: $uri) {
      children {
        edges {
          node {
            id
            slug
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
          slug
          uri
          ... on Page {
            title
          }
        }
      }
      slug
      title
      uri
    }
  }
`;
