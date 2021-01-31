import { getAllAuthors, getUserByNameSlug, userSlugByName } from 'lib/users';
import { getPostsByAuthorSlug } from 'lib/posts';

import TemplateArchive from 'templates/archive';
import Title from 'components/Title';
import { AuthorJsonLd } from 'lib/json-ld';

import styles from 'styles/pages/Post.module.scss';

export default function Author({ user, posts }) {
  const { name, avatar, description, slug } = user;

  const postOptions = {
    excludeMetadata: ['author'],
  };

  return (
    <>
      <AuthorJsonLd author={user} />
      <TemplateArchive
        title={name}
        Title={<Title title={name} thumbnail={avatar} />}
        description={description}
        posts={posts}
        postOptions={postOptions}
        slug={slug}
      />
    </>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { user } = await getUserByNameSlug(params?.slug);
  const { posts } = await getPostsByAuthorSlug(user?.slug);
  return {
    props: {
      user,
      posts,
    },
  };
}

export async function getStaticPaths() {
  const routes = {};

  const { authors } = await getAllAuthors();

  const paths = authors.map((author) => {
    const { name } = author;
    return {
      params: {
        slug: userSlugByName(name),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
