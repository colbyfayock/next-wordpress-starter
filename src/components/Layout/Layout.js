import Head from 'next/head';
import styles from './Layout.module.scss';

import Nav from 'components/Nav';
import Footer from 'components/Footer';

const Layout = ({ children, displayNav = true }) => {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { displayNav && <Nav />}
      <main className={styles.main}>
        { children }
      </main>
      <Footer />
    </div>
  )
}

export default Layout;