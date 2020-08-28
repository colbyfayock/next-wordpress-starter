import { Helmet } from 'react-helmet';
import styles from './Layout.module.scss';

import useSite from 'hooks/use-site';

import Nav from 'components/Nav';
import Footer from 'components/Footer';

const Layout = ({ children, displayNav = true }) => {
  const { metadata = {} } = useSite();
  const { name } = metadata;

  const helmetSettings = {
    defaultTitle: name,
    titleTemplate: `%s - ${name}`
  }

  return (
    <div className={styles.container}>
      <Helmet {...helmetSettings}>
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      { displayNav && <Nav />}

      <main className={styles.main}>
        { children }
      </main>

      <Footer />
    </div>
  )
}

export default Layout;