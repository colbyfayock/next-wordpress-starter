import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import styles from 'styles/Post.module.scss';

import { getPostBySlug, getPosts } from 'lib/posts';

import Layout from 'components/Layout';
import Section from 'components/Section';

export default function Post({ post }) {
  const router = useRouter()

  const { slug } = router.query;
  const { title, content } = post;

  return (
    <Layout>
      <Helmet>
        <title>{ title?.rendered }</title>
      </Helmet>

      <Section>
        <h1 className={styles.title} dangerouslySetInnerHTML={{
          __html: title?.rendered
        }} />

        <div className={styles.content} dangerouslySetInnerHTML={{
          __html: content?.rendered
        }} />
      </Section>
    </Layout>
  )
}

export async function getStaticProps({ params = {} } = {}) {
  return {
    props: {
      post: await getPostBySlug(params?.slug)
    }
  }
}

export async function getStaticPaths() {
  const routes = {};

  const posts = await getPosts();

  const paths = posts.map(post => {
    const { slug } = post;
    return {
      params: {
        slug
      }
    }
  });

  return {
    paths,
    fallback: false
  };
}