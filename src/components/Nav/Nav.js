import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

import useSite from 'hooks/use-site';
import useSearch from 'hooks/use-search';
import { postPathBySlug } from 'lib/posts';
import { pagePathBySlug } from 'lib/pages';

import Section from 'components/Section';

import styles from './Nav.module.scss';

const SEARCH_VISIBLE = 'visible';
const SEARCH_HIDDEN = 'hidden';

const Nav = () => {
  const formRef = useRef();

  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);

  const { metadata = {}, navigation } = useSite();
  const { title } = metadata;

  const { query, results, search, clearSearch } = useSearch({
    maxResults: 5,
  });

  // When the search visibility changes, we want to add an event listener that allows us to
  // detect when someone clicks outside of the search box, allowing us to close the results
  // when focus is drawn away from search

  useEffect(() => {
    // If we don't have a query, don't need to bother adding an event listener
    // but run the cleanup in case the previous state instance exists

    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();
    handleResultsRoving();

    // When the search box opens up, additionall find the search input and focus
    // on the element so someone can start typing right away

    const searchInput = Array.from(formRef.current.elements).find((input) => input.type === 'search');

    searchInput.focus();

    return () => removeDocumentOnClick();
  }, [searchVisibility]);

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
      setSearchVisibility(SEARCH_HIDDEN);
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

  /**
   * handleOnToggleSearch
   */

  function handleOnToggleSearch() {
    setSearchVisibility(SEARCH_VISIBLE);
  }

  /**
   * handleResultsRoving
   */
  function handleResultsRoving() {
    const element = formRef.current;
    element.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        //Prevent Window from Scrolling On ArrowDown
        e.preventDefault();
        //Check if Input FIeld Is Focused
        if (document.activeElement.nodeName === 'INPUT') {
          //Focus First Link In Search Result Box
          document.activeElement.nextSibling.children[0].firstChild.firstChild.focus();
          //Check If Next Result Exists
        } else if (document.activeElement.parentElement.nextSibling) {
          //Focus Next Result
          document.activeElement.parentElement.nextSibling.firstChild.focus();
        } else {
          //If No Next Result Select First Result
          document.activeElement.parentElement.parentElement.firstChild.firstChild.focus();
        }
      }
      if (e.key === 'ArrowUp') {
        //Prevent Window From Scrolling On ArrowUp
        e.preventDefault();
        //Check If Focus Element Is a Link & If Previous Result Exist
        if (document.activeElement.nodeName === 'A' && document.activeElement.parentElement.previousSibling) {
          //Focus Previous Result
          document.activeElement.parentElement.previousSibling.firstChild.focus();
        } else {
          //If No Previous Result Select Last Result
          document.activeElement.parentElement.parentElement.lastChild.firstChild.focus();
        }
      }
    });
  }

  return (
    <nav className={styles.nav}>
      <Section className={styles.navSection}>
        <p className={styles.navName}>
          <Link href="/">
            <a>{title}</a>
          </Link>
        </p>
        <ul className={styles.navMenu}>
          {navigation.map(({ slug, title = {} }) => {
            return (
              <li key={slug}>
                <Link href={pagePathBySlug(slug)}>
                  <a>{title}</a>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className={styles.navSearch}>
          {searchVisibility === SEARCH_HIDDEN && (
            <button onClick={handleOnToggleSearch}>
              <span className="sr-only">Toggle Search</span>
              <FaSearch />
            </button>
          )}
          {searchVisibility === SEARCH_VISIBLE && (
            <form ref={formRef} action="/search" data-search-is-active={!!query}>
              <input
                type="search"
                name="q"
                value={query || ''}
                onChange={handleOnSearch}
                autoComplete="off"
                placeholder="Search..."
                required
              />
              <div className={styles.navSearchResults}>
                {results.length > 0 && (
                  <ul>
                    {results.map(({ slug, title }, index) => {
                      return (
                        <li key={slug}>
                          <Link tabIndex={index} href={postPathBySlug(slug)}>
                            <a>{title}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {results.length === 0 && (
                  <p>
                    Sorry, not finding anything for <strong>{query}</strong>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </Section>
    </nav>
  );
};

export default Nav;
