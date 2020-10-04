import { WP_API_ROUTE_PAGES } from 'data/wordpress';

import WpRequest from 'models/wp-request';

/**
 * pagePathBySlug
 */

export function pagePathBySlug(slug) {
  return `/${slug}`;
}

/**
 * getPageBySlug
 */

export async function getPageBySlug(slug) {
  const request = new WpRequest({
    route: `${WP_API_ROUTE_PAGES}?slug=${slug}`,
  });

  const { data } = await request.fetch();

  return data && data[0];
}

/**
 * getPages
 */

export async function getPages({ perPage = 100, page = 1, query = {} } = {}) {
  const params = [`per_page=${perPage}`, `page=${page}`];

  Object.keys(query).forEach((key) => {
    params.push(`${key}=${query[key]}`);
  });

  const request = new WpRequest({
    route: `${WP_API_ROUTE_PAGES}?${params.join('&')}`,
  });

  const { data, headers } = await request.fetch();

  const pages = headers['x-wp-totalpages'];

  return {
    pages: data,
    perPage,
    currentPage: page,
    totalPages: parseInt(pages),
  };
}

/**
 * getAllPages
 */

export async function getAllPages(options) {
  const { pages: initialPages, totalPages } = await getPages(options);
  const indexedArray = [...new Array(totalPages - 1)];

  const remainingPages = await Promise.all(
    indexedArray.map(async (p, index) => {
      const pageIndex = index + 2;
      const { pages, totalPages } = await getPages({
        ...options,
        page: pageIndex,
      });
      return pages;
    })
  );

  const allPages = [...initialPages, ...remainingPages.flat()];

  return {
    pages: allPages,
  };
}

/**
 * getNavigationPages
 */

export async function getNavigationPages() {
  const { pages } = await getAllPages();

  const navPages = pages.filter(({ menu_order: order }) => order > 0);

  return navPages;
}
