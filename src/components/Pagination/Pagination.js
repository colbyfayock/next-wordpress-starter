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
    let pages = [];
    for (let i = 1; i < pagesCount + 1; i++) {
      pages.push(i);
    }
    return pages;
  }, [pagesCount]);

  return (
    <>
      <Helmet>
        {!hasPreviousPage && <link rel="canonical" href={`${homepage}${basePath}`} />}
        {hasPreviousPage && <link rel="prev" href={`${homepage}${path}${currentPage - 1}`} />}
        {hasNextPage && <link rel="next" href={`${homepage}${path}${currentPage + 1}`} />}
      </Helmet>

      <div className={styles.nav}>
        {hasPreviousPage && (
          <Link href={`${path}${currentPage - 1}`}>
            <a className={styles.prev} aria-label="Previous Posts">
              <PreviousIcon /> Previous
            </a>
          </Link>
        )}

        <ul className={styles.pages}>
          {pages.map((page) => {
            const active = page === currentPage;
            return active ? (
              <li key={page}>
                <span className={styles.active}>{page}</span>
              </li>
            ) : (
              <li key={page}>
                <Link href={`${path}${page}`}>
                  <a aria-label={`Page ${page}`}>
                    <span>{page}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>

        {hasNextPage && (
          <Link href={`${path}${currentPage + 1}`}>
            <a className={styles.next} aria-label="Next Posts">
              Next <NextIcon />
            </a>
          </Link>
        )}
      </div>
    </>
  );
};

export default Pagination;
