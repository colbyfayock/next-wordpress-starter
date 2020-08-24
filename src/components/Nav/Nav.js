import Head from 'next/head';
import styles from './Nav.module.scss';

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <a href="/">
        My WordPress App
      </a>
    </nav>
  )
}

export default Nav;