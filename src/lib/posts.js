const ROUTE_POSTS = '/wp/v2/posts';

import WpRequest from 'models/wp-request';

/**
 * getPostBySlug
 */

export async function getPostBySlug(slug) {
  const request = new WpRequest({
    route: `${ROUTE_POSTS}?slug=${slug}`
  });

  const post = await request.fetch();

  return post && post[0];
}

/**
 * getPosts
 */

export async function getPosts() {
  const request = new WpRequest({
    route: ROUTE_POSTS
  });

  const posts = await request.fetch();

  return posts;
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