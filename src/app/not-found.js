import Link from 'next/link';

import styles from '@/styles/pages/Error.module.scss';

export const metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContent}>
        <p className={styles.errorCode}>404</p>
        <h1 className={styles.errorTitle}>Page not found</h1>
        <p className={styles.errorMessage}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or deleted.
        </p>
        <div className={styles.errorActions}>
          <Link href="/" className={styles.errorLink}>
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
