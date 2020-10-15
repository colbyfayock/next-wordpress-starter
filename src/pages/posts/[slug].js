import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';

import { postPathBySlug, getPostBySlug, getAllPosts } from 'lib/posts';
import { formatDate } from 'lib/datetime';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import Metadata from 'components/Metadata';

import styles from 'styles/pages/Post.module.scss';

export default function Post({ post }) {
  const router = useRouter();
  const { homepage } = useSite();

  const { slug } = router.query;
  const { title, content, date, author, categories, modified } = post;

  const route = path.join(homepage, postPathBySlug(slug));

  const metadataOptions = {
    compactCategories: false,
  };

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:url" content={route} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Header>
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <Metadata
          className={styles.postMetadata}
          date={date}
          author={author}
          categories={categories}
          options={metadataOptions}
        />
      </Header>

      <Content>
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
      </Content>

      <Section className={styles.postFooter}>
        <Container>
          <p className={styles.postModified}>Last updated on {formatDate(modified)}.</p>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { post } = await getPostBySlug(params?.slug);
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const routes = {};

  const { posts } = await getAllPosts();

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
