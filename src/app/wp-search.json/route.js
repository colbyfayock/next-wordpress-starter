import he from 'he';

import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const { posts } = await getAllPosts({ queryIncludes: 'index' });

  const index = posts.map((post = {}) => {
    // We need to decode the title because we're using the
    // rendered version which assumes this value will be used
    // within the DOM

    const title = he.decode(post.title);

    return {
      title,
      date: post.date,
      url: post.uri
    };
  });

  return new Response(
    JSON.stringify({
      generated: Date.now(),
      posts: index,
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );
}