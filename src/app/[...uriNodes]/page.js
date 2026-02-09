import { notFound } from 'next/navigation';

import { getNodeByUri, getTemplateDataByNode } from '@/lib/nodes';
import { getSiteMetadata } from '@/lib/site';
import { getAllPosts } from '@/lib/posts';
import { getAllPages } from '@/lib/pages';
import { getAllCategories } from '@/lib/categories';
import { getAllTags } from '@/lib/tags';
import { getAllUsers } from '@/lib/users';

import { default as TemplateAuthor } from '@/templates/author';
import { default as TemplateCategory } from '@/templates/category';
import { default as TemplatePage } from '@/templates/page';
import { default as TemplatePost } from '@/templates/post';
import { default as TemplateTag } from '@/templates/tag';

export const templates = {
  Category: TemplateCategory,
  Page: TemplatePage,
  Post: TemplatePost,
  Tag: TemplateTag,
  User: TemplateAuthor,
};

// By default, certain pages like the User type pages restrict
// public access, but for the use case, users are authors
// and without custom functionality, wouldn't be able to
// display, hence the bypass option for types

// @TODO add section to readme explaining, add to nextconfig?

const bypassRestricted = ['User'];

/**
 * generateStaticParams
 * Pre-generate all post, page, category, and author routes at build time
 */

export async function generateStaticParams() {
  const [{ posts }, { pages }, { categories }, { tags }, { users }] = await Promise.all([
    getAllPosts({ queryIncludes: 'index' }),
    getAllPages({ queryIncludes: 'index' }),
    getAllCategories(),
    getAllTags(),
    getAllUsers(),
  ]);

  // Helper to convert URI to path segments array
  // URIs come as "/path/to/page/" and we need ["path", "to", "page"]
  const uriToParams = (uri) => {
    if (!uri) return null;
    const segments = uri.split('/').filter(Boolean);
    return segments.length > 0 ? { uriNodes: segments } : null;
  };

  const allParams = [
    ...(posts || []).map((post) => uriToParams(post.uri)),
    ...(pages || []).map((page) => uriToParams(page.uri)),
    ...(categories || []).map((category) => uriToParams(category.uri)),
    ...(tags || []).map((tag) => uriToParams(tag.uri)),
    ...(users || []).map((user) => uriToParams(user.uri)),
  ].filter(Boolean);

  return allParams;
}

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
