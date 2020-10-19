import path from 'path';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';

import { getPageById, getAllPages } from 'lib/pages';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Content from 'components/Content';
import Section from 'components/Section';
import Container from 'components/Container';
import FeaturedImage from 'components/FeaturedImage';

import styles from 'styles/pages/Post.module.scss';

export default function Page({ page }) {
  const { metadata = {} } = useSite();
  const { title: siteTitle } = metadata;

  const { title, content, date, featuredImage } = page;

  const pageTitle = title?.rendered;

  const metaDescription = `${title} on ${siteTitle}`;

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Header>
        {featuredImage && (
          <FeaturedImage
            {...featuredImage}
            src={featuredImage.sourceUrl}
            dangerouslySetInnerHTML={featuredImage.caption}
          />
        )}
        <h1 className={styles.title}>{title}</h1>
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
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}, ...rest) {
  const { pages } = await getAllPages();

  const id = pages.find(({ slug }) => slug === params.slug)?.id;

  const { page } = await getPageById(id);

  return {
    props: {
      page,
    },
  };
}

export async function getStaticPaths() {
  const routes = {};

  const { pages } = await getAllPages();

  const paths = pages.map((page) => {
    const { slug } = page;
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
