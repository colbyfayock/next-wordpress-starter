import Link from 'next/link';

import Section from '@/components/Section';
import Container from '@/components/Container';

import styles from '@/styles/pages/Error.module.scss';

export const metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <Section>
      <Container className={styles.center}>
        <h1>Page Not Found</h1>
        <p className={styles.errorCode}>404</p>
        <p className={styles.errorMessage}>The page you were looking for could not be found.</p>
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </Container>
    </Section>
  );
}
