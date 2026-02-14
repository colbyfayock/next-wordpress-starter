import Link from 'next/link';

import { getAllCategories } from '@/lib/categories';
import { getSiteMetadata } from '@/lib/site';

import Section from '@/components/Section';
import Container from '@/components/Container';
import Header from '@/components/Header';
import SectionTitle from '@/components/SectionTitle';
import JSONLD from '@/components/JSONLD';

import styles from '@/styles/pages/Categories.module.scss';

export const revalidate = 3600;

export async function generateMetadata() {
  const metadata = await getSiteMetadata();
  const title = 'Categories';
  return {
    title,
    description: `Browse all categories on ${metadata.title}`,
    openGraph: {
      title,
      description: `Browse all categories on ${metadata.title}`,
    },
  };
}

export default async function CategoriesPage() {
  const title = 'Categories';
  const slug = 'categories';

  const [{ categories }, metadata] = await Promise.all([getAllCategories(), getSiteMetadata()]);

  return (
    <>
      <Header>
        <Container>
          <h1>{title}</h1>
        </Container>
      </Header>

      <Section>
        <Container>
          <SectionTitle>All Categories</SectionTitle>
          <ul className={styles.categories}>
            {categories.map((category) => {
              return (
                <li key={category.slug}>
                  <Link href={category.uri}>{category.name}</Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <JSONLD
        data={{
          '@type': 'WebPage',
          name: title,
          url: `${metadata.url}/${slug}`,
        }}
        metadata={metadata}
      />
    </>
  );
}
