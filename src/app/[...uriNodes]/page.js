import { notFound } from 'next/navigation';

import { getNodeByUri, getTemplateDataByNode } from '@/lib/nodes';
import { getSiteMetadata } from '@/lib/site';

import { default as TemplateAuthor } from '@/templates/author';
import { default as TemplateCategory } from '@/templates/category';
import { default as TemplatePage } from '@/templates/page';
import { default as TemplatePost } from '@/templates/post';

export const templates = {
  Category: TemplateCategory,
  Page: TemplatePage,
  Post: TemplatePost,
  User: TemplateAuthor,
};

// By default, certain pages like the User type pages restrict
// public access, but for the use case, users are authors
// and without custom functionality, wouldn't be able to
// display, hence the bypass option for types

// @TODO add section to readme explaining, add to nextconfig?

const bypassRestricted = ['User'];

export async function generateMetadata({ params }) {
  const { uriNodes } = await params;
  const resolvedUri = uriNodes ? uriNodes.join('/') : null;
  const node = await getNodeByUri(resolvedUri);

  if (!node) {
    return {
      title: 'Not Found',
    };
  }

  // Posts and Pages use 'title', Categories and Users use 'name'
  const title = node.title || node.name || 'Untitled';

  return {
    title,
    openGraph: {
      title,
      images: [
        {
          url: `/opengraph/${uriNodes.join('/')}`,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: title,
        },
      ],
    },
  };
}

export default async function Page({ params = {} }) {
  const { uriNodes } = await params;
  const resolvedUri = uriNodes ? uriNodes.join('/') : null;
  const node = await getNodeByUri(resolvedUri);

  if (!node || (node.isRestricted && !bypassRestricted.includes(node.__typename))) {
    notFound();
  }

  const Component = templates[node.__typename] || templates.Page;
  const { template } = Component;

  const [nodeData, metadata] = await Promise.all([
    getTemplateDataByNode({
      template,
      node,
    }),
    getSiteMetadata(),
  ]);

  const data = typeof template.transformer === 'function' ? template.transformer(nodeData?.data) : nodeData?.data;

  return <Component data={data} metadata={metadata} />;
}
