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

export function getQueryPageById(id) {
  return gql`
    query {
      page(id: "${id}") {
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
}

export function getQueryPageByUri(uri) {
  return gql`
    query {
      pageBy(uri: "${uri}") {
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
}
