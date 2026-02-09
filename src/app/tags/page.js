import Link from 'next/link';

import { getAllTags } from '@/lib/tags';
import { getSiteMetadata } from '@/lib/site';

import Section from '@/components/Section';
import Container from '@/components/Container';
import Header from '@/components/Header';
import SectionTitle from '@/components/SectionTitle';
import JSONLD from '@/components/JSONLD';

import styles from '@/styles/pages/Tags.module.scss';

export async function generateMetadata() {
  const metadata = await getSiteMetadata();
  const title = 'Tags';
  return {
    title,
    description: `Browse all tags on ${metadata.title}`,
    openGraph: {
      title,
      description: `Browse all tags on ${metadata.title}`,
    },
  };
}

export default async function TagsPage() {
  const title = 'Tags';
  const slug = 'tags';

  const [{ tags }, metadata] = await Promise.all([getAllTags(), getSiteMetadata()]);

  return (
    <>
      <Header>
        <Container>
          <h1>{title}</h1>
        </Container>
      </Header>

      <Section>
        <Container>
          <SectionTitle>All Tags</SectionTitle>
          {tags.length > 0 ? (
            <ul className={styles.tags}>
              {tags.map((tag) => {
                return (
                  <li key={tag.slug}>
                    <Link href={tag.uri}>{tag.name}</Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No tags found.</p>
          )}
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
