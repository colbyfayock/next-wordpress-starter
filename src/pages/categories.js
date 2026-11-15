import Link from 'next/link';
import Head from 'next/head';

import useSite from 'hooks/use-site';
import { formatPageTitle } from 'lib/site';
import { getAllCategories, categoryPathBySlug } from 'lib/categories';
import { WebpageJsonLd } from 'lib/json-ld';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import SectionTitle from 'components/SectionTitle';

import styles from 'styles/pages/Categories.module.css';

export default function Categories({ categories }) {
  const { metadata = {} } = useSite();
  const { title: siteTitle } = metadata;
  const title = 'Categories';
  const slug = 'categories';
  let metaDescription = `Read ${categories.length} categories at ${siteTitle}.`;

  return (
    <Layout>
      <Head>
        <title>{formatPageTitle(title, siteTitle)}</title>
        <meta key="description" name="description" content={metaDescription} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={metaDescription} />
      </Head>

      <WebpageJsonLd title={title} description={metaDescription} siteTitle={siteTitle} slug={slug} />

      <Header>
        <Container>
          <h1>Categories</h1>
        </Container>
      </Header>

      <Section>
        <Container>
          <SectionTitle>All Categories</SectionTitle>
          <ul className={styles.categories}>
            {categories.map((category) => {
              return (
                <li key={category.slug}>
                  <Link href={categoryPathBySlug(category.slug)}>{category.name}</Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { categories } = await getAllCategories();

  return {
    props: {
      categories,
    },
  };
}
