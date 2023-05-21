'use client';

import Link from 'next/link';

import Section from '@/components/Section';
import Container from '@/components/Container';
import Button from '@/components/Button';

import styles from '@/styles/pages/Error.module.scss';

export const metadata = {
  title: 'Error',
};

export default function Error({ error, reset }) {
  return (
    <Section>
      <Container className={styles.center}>
        <h1>Something went wrong!</h1>
        <details>
          <summary>Details</summary>
          <p>{error?.message}</p>
        </details>
        <p className={styles.errorRefresh}>
          <Button onClick={() => reset()}>Try Refreshing</Button>
        </p>
        <p>
          <Link href="/">Or go back to home</Link>
        </p>
      </Container>
    </Section>
  );
}
