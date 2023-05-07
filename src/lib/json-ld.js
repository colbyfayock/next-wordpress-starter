import { Helmet } from 'react-helmet';

import { authorPathByName } from '@/lib/users';
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

export function AuthorJsonLd({ author = {} }) {
  const { homepage = '' } = config;
  const { name, avatar, description } = author;
  const path = authorPathByName(name);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    image: avatar?.url,
    url: `${homepage}${path}`,
    description: description,
  };

  return (
    <Helmet encodeSpecialCharacters={false}>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
