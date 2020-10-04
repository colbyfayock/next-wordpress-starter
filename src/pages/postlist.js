import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { getPosts } from 'lib/posts';
import { initializeApollo } from 'lib/apolloClient';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import PostCard from 'components/PostCard';
import PostList, { ALL_POSTS_QUERY } from 'components/PostList';

import styles from 'styles/pages/Home.module.scss';

export default function Home({ posts }) {
  const { metadata = {}, homepage } = useSite();
  const { name, description } = metadata;

  return (
    <Layout>
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
          <PostList />
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ALL_POSTS_QUERY,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
}
