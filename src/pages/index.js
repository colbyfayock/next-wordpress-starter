import Head from 'next/head';
import styles from 'styles/Home.module.scss';

import { getPosts } from 'lib/posts';

import Layout from 'components/Layout';

export default function Home({ posts }) {
  return (
    <Layout displayNav={false}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>

      <p className={styles.description}>
        Filled with sample content from <a href="http://fillerama.io/">fillerama.io</a> for your viewing pleasure.
      </p>

      <ul className={styles.grid}>
        {posts.map(post => {
          const { id, title, excerpt, slug } = post;
          return (
            <li key={`${id}-${slug}`} className={styles.card}>
              <a href={`/posts/${slug}`}>
                <h3>{ title?.rendered }</h3>
                <div dangerouslySetInnerHTML={{
                  __html: excerpt?.rendered
                }} />
              </a>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}


export async function getStaticProps() {
  return {
    props: {
      posts: await getPosts()
    }
  }
}