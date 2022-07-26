import { getPaginatedPosts } from 'lib/posts';
import usePageMetadata from 'hooks/use-page-metadata';

import TemplateArchive from 'templates/archive';

export default function Posts({ posts, pagination }) {
  const title = `All Posts`;
  const slug = 'posts';

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: `Page ${pagination.currentPage}`,
    },
  });

  return <TemplateArchive title={title} posts={posts} slug={slug} pagination={pagination} metadata={metadata} />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { posts, pagination } = await getPaginatedPosts({
    currentPage: params?.page,
    queryIncludes: 'archive',
  });

  if (!pagination.currentPage) {
    return {
      props: {},
      notFound: true,
    };
  }

  return {
    props: {
      posts,
      pagination: {
        ...pagination,
        basePath: '/posts',
      },
    },
  };
}

export async function getStaticPaths() {
  // By default, we don't render any Pagination pages as
  // we're considering them non-critical pages

  // To enable pre-rendering of Category pages:

  // 1. Add import to the top of the file
  //
  // import { getAllPosts, getPagesCount } from 'lib/posts';

  // 2. Uncomment the below
  //
  // const { posts } = await getAllPosts({
  //   queryIncludes: 'index',
  // });
  // const pagesCount = await getPagesCount(posts);

  // const paths = [...new Array(pagesCount)].map((_, i) => {
  //   return { params: { page: String(i + 1) } };
  // });

  // 3. Update `paths` in the return statement below to reference the `paths` constant above

  return {
    paths: [],
    fallback: 'blocking',
  };
}
