import Section from '@/components/Section';
import Container from '@/components/Container';
import Header from '@/components/Header';
import SectionTitle from '@/components/SectionTitle';
import PostCard from '@/components/PostCard';
import JSONLD from '@/components/JSONLD';

import styles from '@/styles/templates/Archive.module.scss';

export default async function Tag({ data, metadata }) {
  const { description, name, posts, uri } = data;

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
          {Array.isArray(posts) && posts.length > 0 ? (
            <ul className={styles.posts}>
              {posts.map((post) => {
                return (
                  <li key={post.uri}>
                    <PostCard post={post} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No posts found with this tag.</p>
          )}
        </Container>
      </Section>

      <JSONLD
        data={{
          '@type': 'CollectionPage',
          name,
          url: `${metadata.url}${uri}`,
          description,
        }}
        metadata={metadata}
      />
    </>
  );
}

Tag.template = {
  query: `
    query TagByUri($uri: ID!) {
      tag(id: $uri, idType: URI) {
        description
        id
        name
        posts {
          edges {
            node {
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
        uri
      }
    }
  `,
  transformer: (data) => {
    return {
      ...data.tag,
      posts: data.tag.posts.edges.map(({ node: post }) => {
        return {
          ...post,
          author: post.author.node,
          categories: post.categories.edges.map(({ node }) => {
            return {
              ...node,
            };
          }),
        };
      }),
    };
  },
  variables: ({ uri }) => {
    return {
      uri,
    };
  },
};
