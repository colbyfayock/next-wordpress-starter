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

  const { title, language, description, twitter } = metadata;

  const url = path.join(homepage, asPath);

  const helmetSettings = {
    defaultTitle: title,
    titleTemplate: process.env.WORDPRESS_PLUGIN_SEO === true ? '%s' : `%s - ${title}`,
    htmlAttributes: {
      lang: language,
    },
    link: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: '/feed.xml',
      },
      {
        rel: 'canonical',
        href: url,
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
        content: url,
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'og:site_name',
        content: title,
      },
      {
        name: 'twitter:site',
        content: `@${twitter.username}`,
      },
      {
        name: 'twitter:card_type',
        content: twitter.cardType,
      },
    ],
  };

  return (
    <div className={styles.layoutContainer}>
      <Helmet {...helmetSettings} />

      <Nav />

      <Main>{children}</Main>

      <Footer />
    </div>
  );
};

export default Layout;
