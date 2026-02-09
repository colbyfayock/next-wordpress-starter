'use client';

import Link from 'next/link';

import Button from '@/components/Button';

import styles from '@/styles/pages/Error.module.scss';

export default function Error({ error, reset }) {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContent}>
        <p className={styles.errorCode}>500</p>
        <h1 className={styles.errorTitle}>Something went wrong</h1>
        <p className={styles.errorMessage}>
          We encountered an unexpected error. Please try again, or return to the homepage.
        </p>
        {error?.message && (
          <details className={styles.errorDetails}>
            <summary>Error details</summary>
            <p>{error.message}</p>
          </details>
        )}
        <div className={styles.errorActions}>
          <Button onClick={() => reset()}>Try Again</Button>
          <Link href="/" className={styles.errorLink}>
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
