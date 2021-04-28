import { getApolloClient } from 'lib/apollo-client';

import { QUERY_ALL_PAGES, getQueryPageById, getQueryPageByUri } from 'data/pages';

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
 * getPageByUri
 */

export async function getPageByUri(uri) {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: getQueryPageByUri(uri),
  });

  const page = [data?.data.pageBy].map(mapPageData)[0];

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

  // Order pages by menuOrder
  navPages.sort((a, b) => parseFloat(a.menuOrder) - parseFloat(b.menuOrder));

  return navPages;
}

/**
 * mapPageData
 */

export function mapPageData(page = {}) {
  const data = { ...page };

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  if (data.parent) {
    data.parent = data.parent.node;
  }

  if (data.children) {
    data.children = data.children.edges.map(({ node }) => node);
  }

  return data;
}

/**
 * getBreadcrumbsByUri
 */

export function getBreadcrumbsByUri(uri, pages) {
  const breadcrumbs = [];
  const uriSegments = uri.split('/').filter((segment) => segment !== '');

  // We don't want to show the current page in the breadcrumbs, so pop off
  // the last chunk before we start

  uriSegments.pop();

  // Work through each of the segments, popping off the last chunk and finding the related
  // page to gather the metadata for the breadcrumbs

  do {
    const breadcrumb = pages.find((page) => page.uri === `/${uriSegments.join('/')}/`);

    // If the breadcrumb is the active page, we want to pass udefined for the uri to
    // avoid the breadcrumbs being rendered as a link, given it's the current page

    if (breadcrumb) {
      breadcrumbs.push({
        id: breadcrumb.id,
        title: breadcrumb.title,
        uri: breadcrumb.uri,
      });
    }

    uriSegments.pop();
  } while (uriSegments.length > 0);

  // When working through the segments, we're doing so from the lowest child to the parent
  // which means the parent will be at the end of the array. We need to reverse to show
  // the correct order for breadcrumbs

  breadcrumbs.reverse();

  return breadcrumbs;
}
