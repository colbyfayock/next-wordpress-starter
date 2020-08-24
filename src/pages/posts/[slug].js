import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from 'styles/Post.module.scss';

import { getPostBySlug, getPosts } from 'lib/posts';

import Layout from 'components/Layout';

export default function Post({ post }) {
  const router = useRouter()

  const { slug } = router.query;
  const { title, content } = post;

  return (
    <Layout>
      <Head>
        <title>{ title?.rendered }</title>
      </Head>

      <h1 className={styles.title} dangerouslySetInnerHTML={{
        __html: title?.rendered
      }} />

      <div className={styles.content} dangerouslySetInnerHTML={{
        __html: content?.rendered
      }} />
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