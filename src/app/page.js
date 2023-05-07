import { getSiteMetadata } from '@/lib/site';
import { getPaginatedPosts } from '@/lib/posts';

import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import JSONLD from '@/components/JSONLD';

import styles from '@/styles/pages/Home.module.scss';

export default async function Home() {  
  const [metadata, { posts, pagination }] = await Promise.all([
    getSiteMetadata(),
    getPaginatedPosts({
      queryIncludes: 'archive',
    })
  ]);

  pagination.basePath = '/posts';
  
  return (
    <>
      <Header>
        <h1
          dangerouslySetInnerHTML={{
            __html: metadata.title,
          }}
        />

        <p
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: metadata.description,
          }}
        />
      </Header>

      <Section>
        <Container>
          <h2 className="sr-only">Posts</h2>
          
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
              addCanonical={false}
              currentPage={pagination?.currentPage}
              pagesCount={pagination?.pagesCount}
              basePath={pagination?.basePath}
            />
          )}
        </Container>
      </Section>

      <JSONLD data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        copyrightYear: new Date().getFullYear(),
        name: metadata.title,
        url: metadata.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${metadata.url}/search/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        }
      }} />
    </>
  )
}
