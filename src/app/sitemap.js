import { getSiteMetadata } from '@/lib/site';
import { getAllPages } from '@/lib/pages';
import { getAllPosts } from '@/lib/posts';

export default async function sitemap() {
  const metadata = await getSiteMetadata();
  const { pages: allPages } = await getAllPages();
  const { posts: allPosts } = await getAllPosts();

  const pages = allPages.map(({ modified, uri }) => {
    return {
      url: `${metadata.url}${uri}`,
      lastModified: modified,
    };
  });

  const posts = allPosts.map(({ modified, uri }) => {
    return {
      url: `${metadata.url}${uri}`,
      lastModified: modified,
    };
  });

  return [
    {
      url: metadata.url,
      lastModified: new Date(),
    },
    ...pages,
    ...posts,
  ];
}
