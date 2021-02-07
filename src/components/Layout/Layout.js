import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import styles from './Layout.module.scss';

import useSite from 'hooks/use-site';

import Nav from 'components/Nav';
import Main from 'components/Main';
import Footer from 'components/Footer';

const Layout = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;

  const { homepage, metadata = {} } = useSite();
  const { title, language, description } = metadata;

  const helmetSettings = {
    defaultTitle: title,
    titleTemplate: `%s - ${title}`,
  };

  const metaDescription = `${description} at ${title}`;

  return (
    <div className={styles.layoutContainer}>
      <Helmet {...helmetSettings}>
        <html lang={language} />
        <meta name="description" content={metaDescription} />

        {/* Favicon sizes and manifest generated via https://favicon.io/ */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={path.join(homepage, asPath)} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title} />

        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </Helmet>

      <Nav />

      <Main>{children}</Main>

      <Footer />
    </div>
  );
};

export default Layout;
