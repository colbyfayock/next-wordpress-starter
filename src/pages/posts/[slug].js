import path from 'path';
import { Helmet } from 'react-helmet';

import { getPostBySlug, getAllPosts } from 'lib/posts';
import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import Metadata from 'components/Metadata';
import FeaturedImage from 'components/FeaturedImage';

import styles from 'styles/pages/Post.module.scss';

export default function Post({ post, socialImage }) {
  const { metadata, homepage } = useSite();
  const { title: siteTitle } = metadata;

  const { title, content, excerpt, date, author, categories, modified, featuredImage, isSticky = false } = post;

  console.log('socialImage', `${homepage}${socialImage}`);

  const metadataOptions = {
    compactCategories: false,
  };

  const metaDescription = `Read ${title} at ${siteTitle}.`;

  const socialsocialimage = `${homepage}${socialImage}`;

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={socialsocialimage} />
        <meta property="og:image:secure_url" content={socialsocialimage} />
        <meta property="og:image:width" content="2000" />
        <meta property="og:image:height" content="1000" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content={socialsocialimage} />
      </Helmet>

      <ArticleJsonLd post={post} siteTitle={siteTitle} />

      <Header>
        {featuredImage && (
          <FeaturedImage
            {...featuredImage}
            src={featuredImage.sourceUrl}
            dangerouslySetInnerHTML={featuredImage.caption}
          />
        )}
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <img src={socialImage} />
        <Metadata
          className={styles.postMetadata}
          date={date}
          author={author}
          categories={categories}
          options={metadataOptions}
          isSticky={isSticky}
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

  const socialImage = `/images/${params?.slug}.png`;

  return {
    props: {
      post,
      socialImage,
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
