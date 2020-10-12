import { getAllAuthors, getUserBySlug } from 'lib/users';
import { getPostsByAuthorSlug } from 'lib/posts';

import TemplateArchive from 'templates/archive';
import Title from 'components/Title';

import styles from 'styles/pages/Post.module.scss';

export default function Author({ user, posts }) {
  const { name, avatar } = user;

  const postOptions = {
    excludeMetadata: ['author'],
  };

  return <TemplateArchive title={<Title title={name} thumbnail={avatar} />} posts={posts} postOptions={postOptions} />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { user } = await getUserBySlug(params?.slug);
  const { posts } = await getPostsByAuthorSlug(params?.slug);
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
    const { slug } = author;
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
