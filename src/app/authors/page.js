import Link from 'next/link';
import Image from 'next/image';

import { getAllUsers } from '@/lib/users';
import { getSiteMetadata } from '@/lib/site';

import Section from '@/components/Section';
import Container from '@/components/Container';
import Header from '@/components/Header';
import SectionTitle from '@/components/SectionTitle';
import JSONLD from '@/components/JSONLD';

import styles from '@/styles/pages/Authors.module.scss';

export async function generateMetadata() {
  const metadata = await getSiteMetadata();
  const title = 'Authors';
  return {
    title,
    description: `Meet the authors and contributors on ${metadata.title}`,
    openGraph: {
      title,
      description: `Meet the authors and contributors on ${metadata.title}`,
    },
  };
}

export default async function AuthorsPage() {
  const title = 'Authors';
  const slug = 'authors';

  const [{ users }, metadata] = await Promise.all([getAllUsers(), getSiteMetadata()]);

  return (
    <>
      <Header>
        <Container>
          <h1>{title}</h1>
        </Container>
      </Header>

      <Section>
        <Container>
          <SectionTitle>All Authors</SectionTitle>
          <ul className={styles.authors}>
            {users.map((user) => {
              return (
                <li key={user.slug}>
                  <Link href={user.uri} className={styles.author}>
                    {user.avatar?.url && (
                      <span className={styles.authorAvatar}>
                        <Image src={user.avatar.url} alt={user.name} width={80} height={80} />
                      </span>
                    )}
                    <span className={styles.authorInfo}>
                      <span className={styles.authorName}>{user.name}</span>
                      {user.description && <span className={styles.authorDescription}>{user.description}</span>}
                    </span>
                  </Link>
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
