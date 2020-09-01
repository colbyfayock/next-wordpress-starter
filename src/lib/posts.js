const ROUTE_POSTS = '/wp/v2/posts';

import WpRequest from 'models/wp-request';

/**
 * getPostBySlug
 */

export async function getPostBySlug(slug) {
  const request = new WpRequest({
    route: `${ROUTE_POSTS}?slug=${slug}`
  });

  const { data: post } = await request.fetch();

  return post && post[0];
}

/**
 * getPosts
 */

export async function getPosts({ perPage = 100, page = 1, query = {} } = {}) {
  const params = [
    `per_page=${perPage}`,
    `page=${page}`
  ];

  Object.keys(query).forEach(key => {
    params.push(`${key}=${query[key]}`);
  })

  const request = new WpRequest({
    route: `${ROUTE_POSTS}?${params.join('&')}`
  });

  const { data: posts, headers } = await request.fetch();

  const pages = headers['x-wp-totalpages'];

  return {
    posts,
    perPage,
    currentPage: page,
    totalPages: parseInt(pages)
  };
}

/**
 * getAllPosts
 */

export async function getAllPosts(options) {
  const { posts, totalPages } = await getPosts(options);
  const indexedArray = [...new Array(totalPages - 1)];

  const remainingPosts = await Promise.all(indexedArray.map(async (p, index) => {
    const pageIndex = index + 2;
    const { posts, totalPages } = await getPosts({
      ...options,
      page: pageIndex
    });
    return posts;
  }));

  const allPosts = [...posts, ...remainingPosts.flat()];

  return {
    posts: allPosts
  };
}

/**
 * sanitizeExcerpt
 */

export function sanitizeExcerpt(excerpt) {
  if ( typeof excerpt !== 'string' ) {
    throw new Error(`Failed to sanitize excerpt: invalid type ${typeof excerpt}`)
  }

  let sanitized = excerpt;

  sanitized = sanitized.replace(/\s?\[\&hellip\;\]/, '...');
  sanitized = sanitized.replace('....', '...');

  return sanitized;
}