'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import useSearch from '@/hooks/use-search';

import Section from '@/components/Section';
import Container from '@/components/Container';
import Header from '@/components/Header';
import SectionTitle from '@/components/SectionTitle';
import PostCard from '@/components/PostCard';

import styles from '@/styles/templates/Archive.module.scss';

function SearchResults() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');

  const { query, results, search, isLoading } = useSearch();

  useEffect(() => {
    if (queryParam) {
      search({ query: queryParam });
    }
  }, [queryParam, search]);

  return (
    <>
      <Header>
        <Container>
          <h1>Search</h1>
          {query && <p>Results for: {query}</p>}
        </Container>
      </Header>

      <Section>
        <Container>
          {isLoading && <p>Loading...</p>}

          {!isLoading && query && (
            <>
              <SectionTitle>
                {results.length} {results.length === 1 ? 'Result' : 'Results'}
              </SectionTitle>
              {results.length > 0 ? (
                <ul className={styles.posts}>
                  {results.map((post) => {
                    return (
                      <li key={post.uri}>
                        <PostCard post={post} />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No results found for &ldquo;{query}&rdquo;.</p>
              )}
            </>
          )}

          {!isLoading && !query && <p>Enter a search term to find posts.</p>}
        </Container>
      </Section>
    </>
  );
}

function SearchFallback() {
  return (
    <>
      <Header>
        <Container>
          <h1>Search</h1>
        </Container>
      </Header>
      <Section>
        <Container>
          <p>Loading...</p>
        </Container>
      </Section>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  );
}
