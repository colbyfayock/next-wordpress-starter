import { useEffect, useRef } from 'react';
import Link from 'next/link';

import useSite from 'hooks/use-site';
import useSearch from 'hooks/use-search';

import Section from 'components/Section';

import styles from './Nav.module.scss';

const Nav = () => {
  const formRef = useRef();

  const { metadata = {} } = useSite();
  const { name } = metadata;

  const { query, results, search, clearSearch } = useSearch({
    maxResults: 5,
  });

  useEffect(() => {
    // If we don't have a query, don't need to bother adding an event listener
    // but run the cleanup in case the previous state instance exists

    if (!query) {
      removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();

    return () => removeDocumentOnClick();
  }, [query]);

  /**
   * addDocumentOnClick
   */

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * removeDocumentOnClick
   */

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * handleOnDocumentClick
   */

  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      clearSearch();
    }
  }

  /**
   * handleOnSearch
   */

  function handleOnSearch({ currentTarget }) {
    search({
      query: currentTarget.value,
    });
  }

  return (
    <nav className={styles.nav}>
      <Section className={styles.navSection}>
        <p className={styles.navName}>
          <a href="/">{name}</a>
        </p>
        <form ref={formRef} className={styles.navSearch} action="/search" data-search-is-active={!!query}>
          <input type="search" name="q" value={query || ''} onChange={handleOnSearch} autoComplete="off" required />
          <div className={styles.navSearchResults}>
            {results.length > 0 && (
              <ul>
                {results.map(({ slug, title }) => {
                  return (
                    <li key={slug}>
                      <Link href={`/posts/${slug}`}>
                        <a>{title}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </form>
      </Section>
    </nav>
  );
};

export default Nav;
