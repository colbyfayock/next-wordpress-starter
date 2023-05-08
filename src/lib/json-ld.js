import { Helmet } from 'react-helmet';

import { pagePathBySlug } from '@/lib/pages';

import config from '../../package.json';

export function WebpageJsonLd({ title = '', description = '', siteTitle = '', slug = '' }) {
  const { homepage = '' } = config;
  const path = pagePathBySlug(slug);

  const jsonLd = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: `${homepage}${path}`,
    publisher: {
      '@type': 'ProfilePage',
      name: siteTitle,
    },
  };

  return (
    <Helmet encodeSpecialCharacters={false}>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
