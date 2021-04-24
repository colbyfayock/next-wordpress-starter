import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import styles from './Layout.module.scss';

import { useSite } from 'hooks/use-site';

import Nav from 'components/Nav';
import Main from 'components/Main';
import Footer from 'components/Footer';

const Layout = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;

  const { homepage, metadata = {} } = useSite();
  console.log('metadata', metadata);
  const { title, language, description } = metadata;

  const helmetSettings = {
    defaultTitle: title,
    titleTemplate: `%s - ${title}`,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        name: 'og:title',
        content: title,
      },
      {
        name: 'og:description',
        content: description,
      },
      {
        name: 'og:url',
        content: path.join(homepage, asPath),
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'og:site_name',
        content: title,
      },
    ],
  };

  return (
    <div className={styles.layoutContainer}>
      <Helmet {...helmetSettings}>
        <html lang={language} />

        {/* Favicon sizes and manifest generated via https://favicon.io/ */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </Helmet>

      <Nav />

      <Main>{children}</Main>

      <Footer />
    </div>
  );
};

export default Layout;
