import path from 'path';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';

import { getAllAuthors, getUserBySlug, authorPathBySlug } from 'lib/users';
import { getPostsByAuthorSlug } from 'lib/posts';
import useSite from 'hooks/use-site';

import TemplateArchive from 'templates/archive';
import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import Metadata from 'components/Metadata';

import styles from 'styles/pages/Post.module.scss';

export default function Author({ user, posts }) {
  const { name } = user;

  const postOptions = {
    excludeMetadata: ['author'],
  };

  return <TemplateArchive title={name} posts={posts} postOptions={postOptions} />;
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
