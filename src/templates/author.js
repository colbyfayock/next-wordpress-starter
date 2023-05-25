import { updateUserAvatar } from '@/lib/users';

import Section from '@/components/Section';
import Container from '@/components/Container';
import Header from '@/components/Header';
import SectionTitle from '@/components/SectionTitle';
import PostCard from '@/components/PostCard';
import JSONLD from '@/components/JSONLD';

import styles from '@/styles/templates/Author.module.scss';

export default async function Author({ data, metadata }) {
  const { avatar, description, name, posts, uri } = data;

  // const { metadata } = usePageMetadata({
  //   metadata: {
  //     ...user,
  //     title,
  //     description: description || user.og?.description || `Read ${posts.length} posts from ${name}`,
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
        <Container>
          <h1>{name}</h1>
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
          {Array.isArray(posts) && (
            <>
              <ul className={styles.posts}>
                {posts.map((post) => {
                  return (
                    <li key={post.uri}>
                      <PostCard
                        post={post}
                        options={{
                          excludeMetadata: ['author'],
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
              {/* {pagination && (
                <Pagination
                  currentPage={pagination?.currentPage}
                  pagesCount={pagination?.pagesCount}
                  basePath={pagination?.basePath}
                />
              )} */}
            </>
          )}
        </Container>
      </Section>

      <JSONLD
        data={{
          '@type': 'Person',
          name,
          image: avatar?.url,
          url: `${metadata.url}${uri}`,
          description,
        }}
        metadata={metadata}
      />
    </>
  );
}

Author.template = {
  query: `
    query UserByUri($uri: ID!) {
      user(id: $uri, idType: URI) {
        avatar {
          height
          width
          url
        }
        description
        id
        name
        posts {
          edges {
            node {
              categories {
                edges {
                  node {
                    databaseId
                    id
                    name
                    uri
                  }
                }
              }
              date
              excerpt
              id
              isSticky
              modified
              postId
              title
              uri
            }
          }
        }
        roles {
          nodes {
            name
          }
        }
        uri
      }
    }
  `,
  transformer: (data) => {
    return {
      ...data.user,
      avatar: data.user.avatar && updateUserAvatar(data.user.avatar),
      posts: data.user.posts.edges.map(({ node: post }) => {
        return {
          ...post,
          categories: post.categories.edges.map(({ node }) => {
            return {
              ...node,
            };
          }),
        };
      }),
      roles: [...data.user.roles.nodes],
    };
  },
  variables: ({ uri }) => {
    return {
      uri,
    };
  },
};
