import { useMemo } from 'react';

import { initializeApollo } from 'lib/apollo-client';

export default function useApolloClient(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
