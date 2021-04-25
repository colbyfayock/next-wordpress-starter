import { useEffect } from 'react';
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
  }, []);

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: `${results.length} results for ${query}`,
    },
  });

  return <TemplateArchive title={title} posts={results} slug={slug} metadata={metadata} />;
}
