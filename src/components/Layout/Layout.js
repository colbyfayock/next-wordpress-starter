import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './Layout.module.scss';

import useSite from 'hooks/use-site';
import { headElementsFromMetadata } from 'lib/site';

import Nav from 'components/Nav';
import Main from 'components/Main';
import Footer from 'components/Footer';

const Layout = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;

  const { homepage, metadata = {} } = useSite();

  if (!metadata.og) {
    metadata.og = {};
  }

  metadata.og.url = `${homepage}${asPath}`;

  const headElements = headElementsFromMetadata(metadata, {
    link: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: '/feed.xml',
      },

      // Favicon sizes and manifest generated via https://favicon.io/

      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    ],
  });

  return (
    <div className={styles.layoutContainer}>
      <Head>
        <title>{metadata.title}</title>
        {headElements}
      </Head>

      <Nav />

      <Main>{children}</Main>

      <Footer />
    </div>
  );
};

export default Layout;
