import { WP_API_ROUTE_POSTS } from 'data/routes';

import WpRequest from 'models/wp-request';

/**
 * postPathBySlug
 */

export function postPathBySlug(slug) {
  return `/posts/${slug}`;
}

/**
 * getPostBySlug
 */

export async function getPostBySlug(slug) {
  const request = new WpRequest({
    route: `${WP_API_ROUTE_POSTS}?slug=${slug}`,
  });

  const { data } = await request.fetch();

  return data && data[0];
}

/**
 * getPosts
 */

export async function getPosts({ perPage = 100, page = 1, query = {} } = {}) {
  const params = [`per_page=${perPage}`, `page=${page}`];

  Object.keys(query).forEach((key) => {
    params.push(`${key}=${query[key]}`);
  });

  const request = new WpRequest({
    route: `${WP_API_ROUTE_POSTS}?${params.join('&')}`,
  });

  const { data, headers } = await request.fetch();

  const pages = headers['x-wp-totalpages'];

  return {
    posts: data,
    perPage,
    currentPage: page,
    totalPages: parseInt(pages),
  };
}

/**
 * getAllPosts
 */

export async function getAllPosts(options) {
  const { posts: initialPosts, totalPages } = await getPosts(options);
  const indexedArray = [...new Array(totalPages - 1)];

  const remainingPosts = await Promise.all(
    indexedArray.map(async (p, index) => {
      const pageIndex = index + 2;
      const { posts, totalPages } = await getPosts({
        ...options,
        page: pageIndex,
      });
      return posts;
    })
  );

  const allPosts = [...initialPosts, ...remainingPosts.flat()];

  return {
    posts: allPosts,
  };
}

/**
 * sanitizeExcerpt
 */

export function sanitizeExcerpt(excerpt) {
  if (typeof excerpt !== 'string') {
    throw new Error(`Failed to sanitize excerpt: invalid type ${typeof excerpt}`);
  }

  let sanitized = excerpt;

  sanitized = sanitized.replace(/\s?\[\&hellip\;\]/, '...');
  sanitized = sanitized.replace('....', '...');

  return sanitized;
}
