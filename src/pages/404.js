import Link from 'next/link';
import Head from 'next/head';

import useSite from 'hooks/use-site';
import { formatPageTitle } from 'lib/site';

import Layout from 'components/Layout';
import Section from 'components/Section';
import Container from 'components/Container';

import styles from 'styles/pages/Error.module.scss';

export default function Custom404() {
  const { metadata = {} } = useSite();

  return (
    <Layout>
      <Head>
        <title>{formatPageTitle('404 - Page Not Found', metadata.title)}</title>
        <meta key="robots" name="robots" content="noindex, nofollow" />
      </Head>
      <Section>
        <Container className={styles.center}>
          <h1>Page Not Found</h1>
          <p className={styles.errorCode}>404</p>
          <p className={styles.errorMessage}>The page you were looking for could not be found.</p>
          <p>
            <Link href="/">Go back home</Link>
          </p>
        </Container>
      </Section>
    </Layout>
  );
}

// Next.js method to ensure a static page gets rendered
export async function getStaticProps() {
  return {
    props: {},
  };
}
