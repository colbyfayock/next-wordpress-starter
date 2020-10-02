import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { getPosts } from 'lib/posts';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import PostCard from 'components/PostCard';

import searchIndex from 'public/wp-search.json';

import styles from 'styles/Home.module.scss';

export default function Home({ posts }) {
  const { metadata = {} } = useSite();
  const { name, description } = metadata;

  console.log('searchIndex', searchIndex);

  useEffect(() => {
    async function run() {
      const data = await fetch('/wp-search.json');
      const index = await data.json();
      console.log('index', index);
    }
    run();
  }, []);

  return (
    <Layout displayNav={false}>
      <Header>
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{
            __html: name,
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
  const { posts } = await getPosts();
  return {
    props: {
      posts,
    },
  };
}
