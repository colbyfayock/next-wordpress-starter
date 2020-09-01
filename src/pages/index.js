import styles from 'styles/Home.module.scss';

import { getPosts, sanitizeExcerpt } from 'lib/posts';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';

export default function Home({ posts }) {
  const { metadata = {}, searchIndex } = useSite();
  const { name, description } = metadata;

  return (
    <Layout displayNav={false}>
      <Header>
        <h1 className={styles.title} dangerouslySetInnerHTML={{
          __html: name
        }} />

        <p className={styles.description} dangerouslySetInnerHTML={{
          __html: description
        }} />
      </Header>

      <Section>
        <ul className={styles.posts}>
          {posts.map(post => {
            const { id, title, excerpt, slug } = post;
            return (
              <li key={`${id}-${slug}`} className={styles.card}>
                <a href={`/posts/${slug}`}>
                  <h3 dangerouslySetInnerHTML={{
                    __html: title?.rendered
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: excerpt && sanitizeExcerpt(excerpt.rendered)
                  }} />
                </a>
              </li>
            )
          })}
        </ul>
      </Section>
      <Section>
        <h2>Test Search Index</h2>
        <ul>
          {searchIndex.map(({ id, title }) => {
            return (
              <li key={id}>
                { title?.rendered }
              </li>
            )
          })}
        </ul>
      </Section>
    </Layout>
  )
}


export async function getStaticProps() {
  const { posts } = await getPosts();
  return {
    props: {
      posts
    }
  }
}