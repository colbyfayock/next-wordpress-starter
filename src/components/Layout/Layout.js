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
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={path.join(homepage, asPath)} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title} />
      </Helmet>

      <Nav />

      <Main>{children}</Main>

      <Footer />
    </div>
  );
};

export default Layout;
