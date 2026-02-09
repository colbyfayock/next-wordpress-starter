import { notFound } from 'next/navigation';

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

export async function generateMetadata({ params }) {
  const { page } = await params;
  const title = `All Posts - Page ${page}`;
  return {
    title,
    description: `Page ${page} of all posts`,
    openGraph: {
      title,
      description: `Page ${page} of all posts`,
    },
  };
}

export default async function PostsPagePaginated({ params }) {
  const { page } = await params;
  const title = 'All Posts';
  const slug = 'posts';

  const [{ posts, pagination }, metadata] = await Promise.all([
    getPaginatedPosts({
      currentPage: page,
      queryIncludes: 'archive',
    }),
    getSiteMetadata(),
  ]);

  // If page is invalid or out of range, return 404
  if (!pagination.currentPage) {
    notFound();
  }

  return (
    <>
      <Header>
        <Container>
          <h1>{title}</h1>
          <p>Page {pagination.currentPage}</p>
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
          name: `${title} - Page ${pagination.currentPage}`,
          url: `${metadata.url}/${slug}/page/${pagination.currentPage}`,
        }}
        metadata={metadata}
      />
    </>
  );
}
