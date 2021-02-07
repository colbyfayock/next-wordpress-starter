import Link from 'next/link';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';

import { getPageById, getAllPages, pagePathBySlug } from 'lib/pages';
import { WebpageJsonLd } from 'lib/json-ld';
import useSite from 'hooks/use-site';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Content from 'components/Content';
import Section from 'components/Section';
import Container from 'components/Container';
import FeaturedImage from 'components/FeaturedImage';

import styles from 'styles/pages/Page.module.scss';

export default function Page({ page }) {
  const { metadata = {} } = useSite();
  const { title: siteTitle } = metadata;

  const { title, slug, content, date, featuredImage, children, parent } = page;

  const pageTitle = title?.rendered;

  const metaDescription = `${title} on ${siteTitle}`;

  const hasChildren = Array.isArray(children) && children.length > 0;
  const isChild = parent && parent.id;

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
      </Helmet>

      <WebpageJsonLd title={title} description={metaDescription} siteTitle={siteTitle} slug={slug} />

      <Header>
        {isChild && (
          <ul className={styles.breadcrumbs}>
            <li>
              <Link href={pagePathBySlug(parent.slug)}>
                <a>{parent.title}</a>
              </Link>
            </li>
            <li>{title}</li>
          </ul>
        )}
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

        {hasChildren && (
          <Section className={styles.sectionChildren}>
            <Container>
              <aside>
                <p className={styles.childrenHeader}>
                  <strong>{title}</strong>
                </p>
                <ul>
                  {children.map((child) => {
                    return (
                      <li key={child.id}>
                        <Link href={pagePathBySlug(`${slug}/${child.slug}`)}>
                          <a>{child.title}</a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </Container>
          </Section>
        )}
      </Content>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}, ...rest) {
  const { slugParent, slugChild } = params;

  const { pages } = await getAllPages();

  const id = pages.find(({ slug, parent }) => {
    // If there's a child parameter, we need ot make sure we're matching
    // both that we're on the right slug under the right parent

    if (slugChild) {
      // This logic only supports a 1 level deep slug, where we grab the
      // last slug in the params and make sure it, and it's parent, matches
      // our parameters.

      const lastChild = slugChild[slugChild.length - 1];

      return slug === lastChild && parent.slug === slugParent;
    }

    // If there's no child parameter, it's a top level page

    return slug === slugParent;
  })?.id;

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

  // The path matching with Next.js appears to want us to separately specify a top level route
  // along with it's child routes in order for both to be available within a catch all.

  // First we build the tpo level pages where we wouldnt have a secondary param

  const parentPages = pages.map((page) => {
    const { slug, children } = page;
    return {
      params: {
        slugParent: slug,
        slugChild: [],
      },
    };
  });

  // Find any pages that have children

  const pagesWithChildren = pages.filter(({ children }) => Array.isArray(children) && children.length > 0);

  // Then map through those pages to create an additional set of paths for our pages along
  // with their child slugs

  const childPages = pagesWithChildren.map((page) => {
    const { slug, children } = page;
    return {
      params: {
        slugParent: slug,
        slugChild: children.map(({ slug }) => slug),
      },
    };
  });

  // Combine our paths before passing them through

  const paths = [...parentPages, ...childPages];

  return {
    paths,
    fallback: false,
  };
}
