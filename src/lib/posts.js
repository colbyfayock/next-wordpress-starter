import { getApolloClient } from 'lib/apollo-client';

import { QUERY_ALL_POSTS, getQueryPostBySlug, getQueryPostsByAuthorSlug } from 'data/posts';

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
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: getQueryPostBySlug(slug),
  });

  const post = data?.data.postBy;

  return {
    post: [post].map(mapPostData)[0],
  };
}

/**
 * getAllPosts
 */

export async function getAllPosts(options) {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: QUERY_ALL_POSTS,
  });

  const posts = data?.data.posts.edges.map(({ node = {} }) => node);

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
  };
}

export async function getPostsByAuthorSlug(slug) {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: getQueryPostsByAuthorSlug(slug),
  });

  const posts = data?.data.posts.edges.map(({ node = {} }) => node);

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
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

/**
 * mapPostData
 */

export function mapPostData(post = {}) {
  const data = { ...post };

  // Clean up the author object to avoid someone having to look an extra
  // level deeper into the node

  if (data.author) {
    data.author = {
      ...data.author.node,
    };
  }

  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  if (data.author?.avatar) {
    data.author.avatar = {
      ...data.author.avatar,
      url: data.author.avatar.url?.replace('http://', 'https://'),
    };
  }

  return data;
}
