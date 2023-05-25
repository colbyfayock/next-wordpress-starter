import { gql } from '@/lib/request';

import { QUERY_ALL_CATEGORIES } from 'data/categories';

/**
 * getAllCategories
 */

export async function getAllCategories() {
  const data = await gql({
    query: QUERY_ALL_CATEGORIES,
  });

  const categories = data?.data.categories.edges.map(({ node = {} }) => node);

  return {
    categories,
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
