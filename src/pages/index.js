import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { getAllPosts } from 'lib/posts';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import PostCard from 'components/PostCard';

import styles from 'styles/pages/Home.module.scss';

export default function Home({ posts }) {
  const { metadata = {} } = useSite();
  const { title, description } = metadata;

  return (
    <Layout>
      <Header>
        <h1
          className={styles.title}
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
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { posts } = await getAllPosts();
  return {
    props: {
      posts,
    },
  };
}
