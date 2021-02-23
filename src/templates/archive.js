import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { getPosts } from 'lib/posts';
import { WebpageJsonLd } from 'lib/json-ld';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import SectionTitle from 'components/SectionTitle';
import PostCard from 'components/PostCard';

import searchIndex from 'public/wp-search.json';

import styles from 'styles/templates/Archive.module.scss';
import Pagination from '../components/Pagination/Pagination';

const DEFAULT_POST_OPTIONS = {};

export default function TemplateArchive({
  title = 'Archive',
  Title,
  description,
  posts,
  postOptions = DEFAULT_POST_OPTIONS,
  slug,
  pagination,
}) {
  const { metadata = {} } = useSite();
  const { title: siteTitle } = metadata;

  let metaDescription = `Read ${posts.length} posts from ${title} at ${siteTitle}.`;

  if (description) {
    metaDescription = `${metaDescription} ${description}`;
  }

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
      </Helmet>

      <WebpageJsonLd title={title} description={metaDescription} siteTitle={siteTitle} slug={slug} />

      <Header>
        <Container>
          <h1>{Title || title}</h1>
          {description && (
            <p
              className={styles.archiveDescription}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          )}
        </Container>
      </Header>

      <Section>
        <Container>
          <SectionTitle>Posts</SectionTitle>
          <ul className={styles.posts}>
            {posts.map((post) => {
              return (
                <li key={post.slug}>
                  <PostCard post={post} options={postOptions} />
                </li>
              );
            })}
          </ul>
          {pagination && (
            <Pagination
              currentPage={pagination?.currentPage}
              pagesCount={pagination?.pagesCount}
              basePath={pagination?.basePath}
            />
          )}
        </Container>
      </Section>
    </Layout>
  );
}
