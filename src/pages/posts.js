import { useEffect } from 'react';

import { getAllPosts } from 'lib/posts';

import TemplateArchive from 'templates/archive';

export default function Posts({ posts }) {
  return <TemplateArchive title="All Posts" posts={posts} />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { posts } = await getAllPosts();

  return {
    props: {
      posts,
    },
  };
}
