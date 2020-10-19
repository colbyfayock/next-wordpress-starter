import { getApolloClient } from 'lib/apollo-client';

import { QUERY_ALL_PAGES, getQueryPageById } from 'data/pages';

/**
 * pagePathBySlug
 */

export function pagePathBySlug(slug) {
  return `/${slug}`;
}

/**
 * getPageById
 */

export async function getPageById(id) {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: getQueryPageById(id),
  });

  const page = [data?.data.page].map(mapPageData)[0];

  return {
    page,
  };
}

/**
 * getAllPages
 */

export async function getAllPages(options) {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: QUERY_ALL_PAGES,
  });

  const pages = data?.data.pages.edges.map(({ node = {} }) => node).map(mapPageData);

  return {
    pages,
  };
}

/**
 * getNavigationPages
 */

export async function getNavigationPages() {
  const { pages } = await getAllPages();

  const navPages = pages.filter(({ menuOrder }) => menuOrder > 0);

  return navPages;
}

/**
 * mapPageData
 */

export function mapPageData(page = {}) {
  const data = { ...page };

  // Clean up the featured image to make them more easy to access

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  return data;
}
