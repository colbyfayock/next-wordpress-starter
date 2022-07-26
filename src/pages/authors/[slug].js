import { getUserByNameSlug } from 'lib/users';
import { getPostsByAuthorSlug } from 'lib/posts';
import { AuthorJsonLd } from 'lib/json-ld';
import usePageMetadata from 'hooks/use-page-metadata';

import TemplateArchive from 'templates/archive';
import Title from 'components/Title';

export default function Author({ user, posts }) {
  const { title, name, avatar, description, slug } = user;

  const { metadata } = usePageMetadata({
    metadata: {
      ...user,
      title,
      description: description || user.og?.description || `Read ${posts.length} posts from ${name}`,
    },
  });

  const postOptions = {
    excludeMetadata: ['author'],
  };

  return (
    <>
      <AuthorJsonLd author={user} />
      <TemplateArchive
        title={name}
        Title={<Title title={name} thumbnail={avatar} />}
        posts={posts}
        postOptions={postOptions}
        slug={slug}
        metadata={metadata}
      />
    </>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { user } = await getUserByNameSlug(params?.slug);

  if (!user) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { posts } = await getPostsByAuthorSlug({
    slug: user?.slug,
    queryIncludes: 'archive',
  });

  return {
    props: {
      user,
      posts,
    },
  };
}

export async function getStaticPaths() {
  // By default, we don't render any Author pages as they're
  // we're considering them non-critical pages

  // To enable pre-rendering of Author pages:

  // 1. Add import to the top of the file
  //
  // import { getAllAuthors, userSlugByName } from 'lib/users';

  // 2. Uncomment the below
  //
  // const { authors } = await getAllAuthors();

  // const paths = authors.map((author) => {
  //   const { name } = author;
  //   return {
  //     params: {
  //       slug: userSlugByName(name),
  //     },
  //   };
  // });

  // 3. Update `paths` in the return statement below to reference the `paths` constant above

  return {
    paths: [],
    fallback: 'blocking',
  };
}
