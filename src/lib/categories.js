import { getApolloClient } from 'lib/apollo-client';

import { QUERY_ALL_CATEGORIES, getQueryCategoryBySlug } from 'data/categories';

/**
 * categoryPathBySlug
 */

export function categoryPathBySlug(slug) {
  return `/categories/${slug}`;
}

/**
 * getAllCategories
 */

export async function getAllCategories() {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: QUERY_ALL_CATEGORIES,
  });

  const categories = data?.data.categories.edges.map(({ node = {} }) => node);

  return {
    categories,
  };
}

/**
 * getCategoryBySlug
 */

export async function getCategoryBySlug(slug) {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: getQueryCategoryBySlug(slug),
  });

  // Use the first category as we should only be matching 1 with the slug

  const category = data?.data.categories.edges.map(({ node = {} }) => node)[0];

  return {
    category,
  };
}

/**
 * getCategories
 */

export async function getCategories({ count } = {}) {
  const { categories } = await getAllCategories();
  return {
    categories: categories.slice(0, count),
  };
}
