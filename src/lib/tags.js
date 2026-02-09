import { gql } from '@/lib/request';

import { QUERY_ALL_TAGS } from '@/data/tags';

/**
 * getAllTags
 */

export async function getAllTags() {
  const data = await gql({
    query: QUERY_ALL_TAGS,
  });

  const tags = data?.data.tags.edges.map(({ node = {} }) => node);

  return {
    tags,
  };
}

/**
 * getTags
 */

export async function getTags({ count } = {}) {
  const { tags } = await getAllTags();
  return {
    tags: tags.slice(0, count),
  };
}
