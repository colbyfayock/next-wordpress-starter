import styles from './Nav.module.scss';

import useSite from 'hooks/use-site';

const Nav = () => {
  const { metadata = {} } = useSite();
  const { name } = metadata;

  return (
    <nav className={styles.nav}>
      <a href="/">{ name }</a>
    </nav>
  )
}

export default Nav;