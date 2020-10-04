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

  const page = data?.data.page;

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

  const pages = data?.data.pages.edges.map(({ node = {} }) => node);

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
