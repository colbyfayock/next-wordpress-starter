import { getSiteMetadata } from '@/lib/site';
import { getPaginatedPosts } from '@/lib/posts';

import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import PostCard from '@/components/PostCard';
// import Pagination from '@/components/Pagination';

import styles from '@/styles/pages/Home.module.scss';

export default async function Home() {  
  const [metadata, { posts, pagination }] = await Promise.all([
    getSiteMetadata(),
    getPaginatedPosts({
      queryIncludes: 'archive',
    })
  ]);

  pagination.basePath = '/posts';
  
  const { title, description } = metadata;

  return (
    <>
    {/* <WebsiteJsonLd siteTitle={title} /> */}
      <Header>
        <h1
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />

        <p
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: description,
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
          {/* {pagination && (
            <Pagination
              addCanonical={false}
              currentPage={pagination?.currentPage}
              pagesCount={pagination?.pagesCount}
              basePath={pagination?.basePath}
            />
          )} */}
        </Container>
      </Section>
    </>
  )
}
