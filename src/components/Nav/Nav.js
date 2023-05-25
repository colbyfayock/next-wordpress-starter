import Link from 'next/link';

import { getMenuItemsByLocation } from '@/lib/menus';
import { getSiteMetadata } from '@/lib/site';

import Section from '@/components/Section';
import NavSearch from '@/components/NavSearch';
import NavListItem from '@/components/NavListItem';

import styles from './Nav.module.scss';

const NAVIGATION_LOCATION = process.env.WORDPRESS_MENU_LOCATION_NAVIGATION;

async function Nav() {
  const [metadata, menuItems] = await Promise.all([getSiteMetadata(), getMenuItemsByLocation(NAVIGATION_LOCATION)]);

  return (
    <nav className={styles.nav}>
      <Section className={styles.navSection}>
        <p className={styles.navName}>
          <Link href="/">{metadata.title}</Link>
        </p>

        <ul className={styles.navMenu}>
          {menuItems?.map((item) => {
            return <NavListItem key={item.key} className={styles.navSubMenu} item={item} />;
          })}
        </ul>

        <div className={styles.navSearch}>
          <NavSearch />
        </div>
      </Section>
    </nav>
  );
}

export default Nav;
