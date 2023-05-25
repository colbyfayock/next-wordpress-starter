'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Fuse from 'fuse.js';

const SEARCH_KEYS = ['uri', 'title'];

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useSearch({ defaultQuery = null, maxResults } = {}) {
  const [query, setQuery] = useState(defaultQuery);

  const { data, error, isLoading } = useSWR('/wp-search.json', fetcher);

  let client;

  if (data) {
    client = new Fuse(data.posts, {
      keys: SEARCH_KEYS,
      isCaseSensitive: false,
    });
  }

  let results = [];

  // If we have a query, make a search. Otherwise, don't modify the
  // results to avoid passing back empty results

  if (client && query) {
    results = client.search(query).map(({ item }) => item);
  }

  if (maxResults && results.length > maxResults) {
    results = results.slice(0, maxResults);
  }

  // If the defaultQuery argument changes, the hook should reflect
  // that update and set that as the new state

  useEffect(() => setQuery(defaultQuery), [defaultQuery]);

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
    setQuery(null);
  }

  return {
    error,
    isLoading,
    query,
    results,
    search: handleSearch,
    clearSearch: handleClearSearch,
  };
}
