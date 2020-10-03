import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import useSearch from 'hooks/use-search';

import TemplateArchive from 'templates/archive';

export default function Search() {
  const { query, results, search } = useSearch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    search({
      query: params.get('q'),
    });
  }, []);

  const posts = results.map((result) => {
    return {
      ...result,
      title: {
        rendered: result.title,
      },
    };
  });

  return <TemplateArchive title="Search" posts={posts} />;
}
