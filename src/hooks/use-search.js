import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

import searchIndex from 'public/wp-search.json';

const searchKeys = ['slug', 'title'];

const fuse = new Fuse(searchIndex.posts, {
  keys: searchKeys,
  isCaseSensitive: false,
});

export default function useSearch({ defaultQuery, maxResults } = {}) {
  const [query, setQuery] = useState(defaultQuery);
  let results = searchIndex.posts;

  // If the defaultQuery argument changes, the hook should reflect
  // that update and set that as the new state

  useEffect(() => setQuery(defaultQuery), [defaultQuery]);

  // If we have a query, make a search with fuse. Otherwise, don't
  // modify the results to avoid passing back empty results

  if (query) {
    results = fuse.search(query).map(({ item }) => item);
  }

  if (maxResults && results.length > maxResults) {
    results = results.slice(0, maxResults);
  }

  /**
   * handleSearch
   */

  function handleSearch({ query }) {
    setQuery(query);
  }

  /**
   * handleClearSearch
   */

  function handleClearSearch() {
    setQuery(undefined);
  }

  return {
    query,
    results,
    search: handleSearch,
    clearSearch: handleClearSearch,
  };
}
