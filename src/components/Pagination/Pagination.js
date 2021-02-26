import { useMemo } from 'react';
import Link from 'next/link';

import config from '../../../package.json';
import { Helmet } from 'react-helmet';

import { GrPrevious as PreviousIcon, GrNext as NextIcon } from 'react-icons/gr';
import styles from './Pagination.module.scss';

const MAX_NUM_LINKS = 10;

const { homepage = '' } = config;

const Pagination = ({ pagesCount, currentPage, basePath }) => {
  const path = `${basePath}/page/`;

  const hasPreviousPage = pagesCount > 1 && currentPage > 1;
  const hasNextPage = pagesCount > 1 && currentPage < pagesCount;

  const pages = useMemo(() => {
    return [...new Array(pagesCount)].map((_, i) => i + 1);
  }, [pagesCount]);

  return (
    <>
      <Helmet>
        {!hasPreviousPage && <link rel="canonical" href={`${homepage}${basePath}`} />}
        {hasPreviousPage && <link rel="prev" href={`${homepage}${path}${currentPage - 1}`} />}
        {hasNextPage && <link rel="next" href={`${homepage}${path}${currentPage + 1}`} />}
      </Helmet>

      <nav className={styles.nav} role="navigation" aria-label="Pagination Navigation">
        {hasPreviousPage && (
          <Link href={`${path}${currentPage - 1}`}>
            <a className={styles.prev} aria-label="Goto Previous Page">
              <PreviousIcon /> Previous
            </a>
          </Link>
        )}

        <ul className={styles.pages}>
          {pages.map((page) => {
            const active = page === currentPage;
            return active ? (
              <li key={page}>
                <span className={styles.active} aria-label={`Current Page, Page ${page}`} aria-current="true">
                  {page}
                </span>
              </li>
            ) : (
              <li key={page}>
                <Link href={`${path}${page}`}>
                  <a aria-label={`Goto Page ${page}`}>
                    <span>{page}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>

        {hasNextPage && (
          <Link href={`${path}${currentPage + 1}`}>
            <a className={styles.next} aria-label="Goto Next Page">
              Next <NextIcon />
            </a>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Pagination;
