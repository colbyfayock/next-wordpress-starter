import { getAllAuthors, getUserBySlug } from 'lib/users';
import { getAllCategories, getCategoryBySlug } from 'lib/categories';
import { getPostsByCategoryId } from 'lib/posts';

import TemplateArchive from 'templates/archive';
import Title from 'components/Title';

import styles from 'styles/pages/Post.module.scss';

export default function Category({ category, posts }) {
  const { name, description } = category;

  return <TemplateArchive title={name} Title={<Title title={name} />} description={description} posts={posts} />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { category } = await getCategoryBySlug(params?.slug);
  const { posts } = await getPostsByCategoryId(category.categoryId);

  return {
    props: {
      category,
      posts,
    },
  };
}

export async function getStaticPaths() {
  const routes = {};

  const { categories } = await getAllCategories();

  const paths = categories.map((category) => {
    const { slug } = category;
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
