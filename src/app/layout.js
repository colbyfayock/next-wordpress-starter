import { getSiteMetadata } from '@/lib/site';

import Nav from '@/components/Nav';
import Main from '@/components/Main';
import Footer from '@/components/Footer';

import '@/styles/globals.scss';
import styles from '@/styles/layout.module.scss';

export async function generateMetadata() {
  const metadata = await getSiteMetadata();

  return {
    metadataBase: new URL(metadata.url || 'http://localhost:3000'),
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
      images: [],
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
