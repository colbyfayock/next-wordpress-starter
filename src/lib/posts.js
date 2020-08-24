const WORDPRESS_HOST = process.env.WORDPRESS_HOST;
const ROUTE_API = '/wp-json/wp/v2';
const ROUTE_POSTS = '/posts';

/**
 * getPostBySlug
 */

export async function getPostBySlug(slug) {
  const data = await fetch(`${WORDPRESS_HOST}${ROUTE_API}${ROUTE_POSTS}?slug=${slug}`);
  const post = await data.json();
  return post && post[0];
}

/**
 * getPosts
 */

export async function getPosts() {
  const data = await fetch(`${WORDPRESS_HOST}${ROUTE_API}${ROUTE_POSTS}`);
  const posts = await data.json();
  return posts;
}