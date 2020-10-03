import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';

import { getPostBySlug, getPosts } from 'lib/posts';
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
  const { title, content, date } = post;

  const pageTitle = title?.rendered;
  const route = path.join(homepage, '/posts/', slug);

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={route} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Header>
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{
            __html: title?.rendered,
          }}
        />
        <ul className={styles.metadata}>
          <time dateTime={date}>{format(new Date(date), 'PPP')}</time>
        </ul>
      </Header>

      <Section>
        <Container>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: content?.rendered,
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
  const routes = {};

  const { posts } = await getPosts();

  const paths = posts.map((post) => {
    const { slug } = post;
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
