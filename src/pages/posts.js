import { useEffect } from 'react';

import { getAllPosts } from 'lib/posts';

import TemplateArchive from 'templates/archive';

export default function Posts({ posts }) {
  const title = 'All Posts';
  const slug = 'posts';

  return <TemplateArchive title={title} posts={posts} slug={slug} />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { posts } = await getAllPosts();

  return {
    props: {
      posts,
    },
  };
}
