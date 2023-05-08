'use client';

import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

import { getSearchData } from '@/lib/search';

const SEARCH_KEYS = ['slug', 'title'];

export const SEARCH_STATE_LOADING = 'LOADING';
export const SEARCH_STATE_READY = 'READY';
export const SEARCH_STATE_ERROR = 'ERROR';
export const SEARCH_STATE_LOADED = 'LOADED';

export default function useSearch({ defaultQuery = null, maxResults } = {}) {
  const [state, setState] = useState(SEARCH_STATE_READY);
  const [data, setData] = useState(null);
  const [query, setQuery] = useState(defaultQuery);

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

  // On load, we want to immediately pull in the search index, which we're
  // storing clientside and gets built at compile time

  useEffect(() => {
    (async function getData() {
      setState(SEARCH_STATE_LOADING);
      try {
        const searchData = await getSearchData();
        setData(searchData);
        setState(SEARCH_STATE_LOADED);
      } catch (e) {
        setState(SEARCH_STATE_ERROR);
        return;
      }
    })();
    return () => {
      setData(undefined);
      setState(SEARCH_STATE_READY);
    };
  }, []);

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
    state,
    data,
    query,
    results,
    search: handleSearch,
    clearSearch: handleClearSearch,
  };
}
