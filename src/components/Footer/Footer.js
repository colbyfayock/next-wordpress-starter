import Link from 'next/link';

import { getSiteMetadata } from '@/lib/site';
import { getRecentPosts } from '@/lib/posts';
import { getCategories } from '@/lib/categories';

import Section from '@/components/Section';
import Container from '@/components/Container';

import styles from './Footer.module.scss';

async function Footer() {
  const [metadata, { posts: recentPosts }, { categories }] = await Promise.all([
    getSiteMetadata(),
    getRecentPosts({
      count: 5,
      queryIncludes: 'index',
    }),
    getCategories({
      count: 5,
    }),
  ]);

  const { title } = metadata;

  const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
  const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
  const hasMenu = hasRecentPosts || hasRecentCategories;

  return (
    <footer className={styles.footer}>
      {hasMenu && (
        <Section className={styles.footerMenu}>
          <Container>
            <ul className={styles.footerMenuColumns}>
              {hasRecentPosts && (
                <li>
                  <Link className={styles.footerMenuTitle} href="/posts/">
                    <strong>Recent Posts</strong>
                  </Link>
                  <ul className={styles.footerMenuItems}>
                    {recentPosts.map((post) => {
                      const { id, uri, title } = post;
                      return (
                        <li key={id}>
                          <Link href={uri}>{title}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              {hasRecentCategories && (
                <li>
                  <Link href="/categories/" className={styles.footerMenuTitle}>
                    <strong>Categories</strong>
                  </Link>
                  <ul className={styles.footerMenuItems}>
                    {categories.map((category) => {
                      const { id, name, uri } = category;
                      return (
                        <li key={id}>
                          <Link href={uri}>{name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              <li>
                <p className={styles.footerMenuTitle}>
                  <strong>More</strong>
                </p>
                <ul className={styles.footerMenuItems}>
                  <li>
                    <a href="/feed.xml">RSS</a>
                  </li>
                  <li>
                    <a href="/sitemap.xml">Sitemap</a>
                  </li>
                </ul>
              </li>
            </ul>
          </Container>
        </Section>
      )}

      <Section className={styles.footerLegal}>
        <Container>
          <p>
            &copy; {new Date().getFullYear()} {title}
          </p>
        </Container>
      </Section>
    </footer>
  );
}

export default Footer;
