import Link from 'next/link';

import { getRelatedPosts } from '@/lib/posts';
import { categoryPathBySlug } from '@/lib/categories';
import { formatDate } from '@/lib/datetime';
import { updateUserAvatar } from '@/lib/users';

import Section from '@/components/Section';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Content from '@/components/Content';
import FeaturedImage from '@/components/FeaturedImage';
import Metadata from '@/components/Metadata';
import JSONLD from '@/components/JSONLD';

import styles from '@/styles/templates/Post.module.scss';

export default async function Post({ data, metadata }) {
  const { author, categories, content, date, excerpt, id, isSticky = false, featuredImage, modified, title } = data;

  const datePublished = new Date(date);
  const dateModified = modified ? new Date(modified) : new Date(date);

  const [{ category: relatedCategory, posts: relatedPosts }] = await Promise.all([getRelatedPosts(categories, id)]);

  let related;

  if (relatedCategory && Array.isArray(relatedPosts) && relatedPosts.length) {
    related = {
      posts: relatedPosts,
      title: {
        name: relatedCategory.name || null,
        link: categoryPathBySlug(relatedCategory.slug),
      },
    };
  }

  // post.og.imageUrl = `${homepage}${socialImage}`;
  // post.og.imageSecureUrl = post.og.imageUrl;
  // post.og.imageWidth = 2000;
  // post.og.imageHeight = 1000;

  // const { metadata } = usePageMetadata({
  //   metadata: {
  //     ...post,
  //     title: metaTitle,
  //     description: description || post.og?.description || `Read more about ${title}`,
  //   },
  // });

  // if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
  //   metadata.title = `${title} - ${siteMetadata.title}`;
  //   metadata.og.title = metadata.title;
  //   metadata.twitter.title = metadata.title;
  // }

  return (
    <>
      <Header>
        {featuredImage && <FeaturedImage featuredImage={featuredImage} />}
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
          options={{
            compactCategories: false,
          }}
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
          {Array.isArray(related?.posts) && related.posts.length > 0 && (
            <div className={styles.relatedPosts}>
              {related.title?.name ? (
                <span>
                  More from <Link href={related.title.link}>{related.title.name}</Link>
                </span>
              ) : (
                <span>More Posts</span>
              )}
              <ul>
                {related.posts.map((post) => (
                  <li key={post.title}>
                    <Link href={post.uri}>{post.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>

      <JSONLD
        data={{
          '@type': 'Article',
          mainEntityOfPage: metadata.url,
          headline: title,
          image: [featuredImage?.sourceUrl],
          datePublished: datePublished.toISOString(),
          dateModified: dateModified.toISOString(),
          description: excerpt,
          keywords: categories.map(({ name }) => `${name}`),
          copyrightYear: datePublished.getFullYear(),
          author: {
            '@type': 'Person',
            name: author?.name,
          },
        }}
        metadata={metadata}
      />
    </>
  );
}

Post.template = {
  query: `
    query PostByUri($uri: ID!) {
      post(id: $uri, idType: URI) {
        author {
          node {
            avatar {
              height
              url
              width
            }
            id
            name
            uri
          }
        }
        id
        categories {
          edges {
            node {
              databaseId
              id
              name
              slug
            }
          }
        }
        content
        date
        excerpt
        featuredImage {
          node {
            altText
            caption
            mediaDetails {
              height
              width
            }
            sourceUrl
            srcSet
            sizes
            id
          }
        }
        modified
        databaseId
        title
        slug
        isSticky
      }
    }
  `,
  transformer: (data) => {
    const post = { ...data.post };

    // Clean up the author object to avoid someone having to look an extra
    // level deeper into the node

    if (post.author) {
      post.author = {
        ...post.author.node,
      };
    }

    // The URL by default that comes from Gravatar / WordPress is not a secure
    // URL. This ends up redirecting to https, but it gives mixed content warnings
    // as the HTML shows it as http. Replace the url to avoid those warnings
    // and provide a secure URL by default

    if (post.author?.avatar) {
      post.author.avatar = updateUserAvatar(post.author.avatar);
    }

    // Clean up the categories to make them more easy to access

    if (post.categories) {
      post.categories = post.categories.edges.map(({ node }) => node);
    }

    // Clean up the featured image to make them more easy to access

    if (post.featuredImage) {
      post.featuredImage = post.featuredImage.node;
    }

    return post;
  },
  variables: ({ uri }) => {
    return {
      uri,
    };
  },
};
