import { getSiteMetadata } from '@/lib/site';

import Nav from '@/components/Nav';
import Main from '@/components/Main';
import Footer from '@/components/Footer';

import '@/styles/globals.scss';
import styles from '@/styles/layout.module.scss';

export async function generateMetadata({ params, searchParams }, parent) {
  const metadata = await getSiteMetadata();

  return {
    title: {
      default: metadata.title,
      template: process.env.WORDPRESS_PLUGIN_SEO === true ? '%s' : `%s - ${metadata.title}`,
    },
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: metadata.url,
      siteName: metadata.title,
      images: [
        // {
        //   url: 'https://nextjs.org/og.png',
        //   width: 800,
        //   height: 600,
        // },
      ],
      locale: metadata.language,
      type: 'website',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className={styles.layoutContainer}>
          <Nav />
          <Main>{children}</Main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

// const helmetSettings = {

//   ...helmetSettingsFromMetadata(metadata, {
//     setTitle: false,
//     link: [
//       {
//         rel: 'alternate',
//         type: 'application/rss+xml',
//         href: '/feed.xml',
//       },

//       // Favicon sizes and manifest generated via https://favicon.io/

//       {
//         rel: 'apple-touch-icon',
//         sizes: '180x180',
//         href: '/apple-touch-icon.png',
//       },
//       {
//         rel: 'icon',
//         type: 'image/png',
//         sizes: '16x16',
//         href: '/favicon-16x16.png',
//       },
//       {
//         rel: 'icon',
//         type: 'image/png',
//         sizes: '32x32',
//         href: '/favicon-32x32.png',
//       },
//       {
//         rel: 'manifest',
//         href: '/site.webmanifest',
//       },
//     ],
//   }),
// };
