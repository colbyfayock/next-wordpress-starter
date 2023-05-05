import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import usePageMetadata from 'hooks/use-page-metadata';

import useSearch from 'hooks/use-search';

import TemplateArchive from 'templates/archive';

export default function Search() {
  const { query, results, search } = useSearch();
  const title = 'Search';
  const slug = 'search';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    search({
      query: params.get('q'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: `Search results for ${query}`,
    },
  });

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <TemplateArchive title={title} posts={results} slug={slug} metadata={metadata} />
    </>
  );
}

// Next.js method to ensure a static page gets rendered
export async function getStaticProps() {
  return {
    props: {},
  };
}
