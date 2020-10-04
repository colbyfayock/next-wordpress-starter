import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { initializeApollo } from 'lib/apolloClient';
import { gql, useQuery, NetworkStatus } from '@apollo/client';
import { getPostSlugs, getPostBySlug } from 'lib/postsql';

import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';

import styles from 'styles/pages/Post.module.scss';

export default function Post({ post }) {
  const router = useRouter();
  const { homepage } = useSite();

  const { slug } = router.query;
  const { title, content, date } = post.data.postBy;

  const route = path.join(homepage, '/posts/', slug);

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:url" content={route} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Header>
        <h1>{title}</h1>
        <ul className={styles.metadata}>
          <time dateTime={date}>{format(new Date(date), 'PPP')}</time>
        </ul>
      </Header>

      <Section>
        <Container>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  return {
    props: {
      post: await getPostBySlug(params?.slug),
    },
  };
}

export async function getStaticPaths() {
  const response = await getPostSlugs();
  const paths = response.data.posts.edges.map((post) => {
    const { slug } = post.node;
    return {
      params: {
        slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
