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

export function mapPostData(post) {
  return {
    ...post,
    author: {
      ...post.author?.node,
    },
  };
}
