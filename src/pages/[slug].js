import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';

import { getPageBySlug, getAllPages } from 'lib/pages';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Content from 'components/Content';
import Section from 'components/Section';
import Container from 'components/Container';

import styles from 'styles/pages/Post.module.scss';

export default function Page({ page }) {
  const router = useRouter();
  const { homepage } = useSite();

  const { slug } = router.query;
  const { title, content, date } = page;

  const pageTitle = title?.rendered;
  const route = path.join(homepage, '/', slug);

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

      <Content>
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
      </Content>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  return {
    props: {
      page: await getPageBySlug(params?.slug),
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
