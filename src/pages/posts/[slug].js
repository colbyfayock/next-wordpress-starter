import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import styles from 'styles/Post.module.scss';

import { getPostBySlug, getPosts } from 'lib/posts';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';

export default function Post({ post }) {
  const router = useRouter();
  const { homepage } = useSite();

  const { slug } = router.query;
  const { title, content } = post;

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
      </Header>

      <Section>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: content?.rendered,
          }}
        />
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
