import { getPaginatedPosts } from '@/lib/posts';
import { getSiteMetadata } from '@/lib/site';

import Section from '@/components/Section';
import Container from '@/components/Container';
import Header from '@/components/Header';
import SectionTitle from '@/components/SectionTitle';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination/Pagination';
import JSONLD from '@/components/JSONLD';

import styles from '@/styles/templates/Archive.module.scss';

export async function generateMetadata() {
  const metadata = await getSiteMetadata();
  const title = 'All Posts';
  return {
    title,
    description: metadata.description,
    openGraph: {
      title,
      description: metadata.description,
    },
  };
}

export default async function PostsPage() {
  const title = 'All Posts';
  const slug = 'posts';

  const [{ posts, pagination }, metadata] = await Promise.all([
    getPaginatedPosts({
      queryIncludes: 'archive',
    }),
    getSiteMetadata(),
  ]);

  return (
    <>
      <Header>
        <Container>
          <h1>{title}</h1>
        </Container>
      </Header>

      <Section>
        <Container>
          <SectionTitle>Posts</SectionTitle>
          {Array.isArray(posts) && (
            <>
              <ul className={styles.posts}>
                {posts.map((post) => {
                  return (
                    <li key={post.slug}>
                      <PostCard post={post} />
                    </li>
                  );
                })}
              </ul>
              {pagination && (
                <Pagination
                  currentPage={pagination?.currentPage}
                  pagesCount={pagination?.pagesCount}
                  basePath="/posts"
                />
              )}
            </>
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
