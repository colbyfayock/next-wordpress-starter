import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import ReactHtmlParser from 'react-html-parser';
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
        <title>{ pageTitle }</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={route} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Header>
        <h1 className={styles.title}>{ ReactHtmlParser(title?.rendered) }</h1>
      </Header>

      <Section>
        <div className={styles.content}>{ ReactHtmlParser(content?.rendered, {
          transform: (node) => {
            if ( node.name !== 'img' ) return;
            const { attribs = {} } = node;
            const { src, srcset  } = attribs;

            const srctemp = 'images/wp-content/2020/08/fry-cheer.png';

            return <img {...attribs} data-wordpress src={srctemp} srcset=""  />
          }
        }) }</div>
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