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

  const url = `${homepage}${asPath}`;

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
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:url',
        content: url,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: twitter?.title || title,
      },
      {
        property: 'twitter:title',
        content: twitter?.description || description,
      },
      {
        property: 'twitter:description',
        content: description,
      },
      {
        property: 'twitter:site',
        content: `@${twitter?.username}`,
      },
      {
        property: 'twitter:card_type',
        content: twitter?.cardType,
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
