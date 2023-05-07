import { notFound } from 'next/navigation';

import { getNodeByUri, getTemplateDataByNode } from '@/lib/nodes';

import { default as TemplatePage } from '@/templates/page';
import { default as TemplatePost } from '@/templates/post';

const templates = {
  Page: TemplatePage,
  Post: TemplatePost,
};

export default async function Page({ params = {} }) {
  const { uriNodes } = params;

  let resolvedUri = null;

  if ( uriNodes) {
    resolvedUri = uriNodes.join('/');
  }

  const node = await getNodeByUri(resolvedUri)

  if (!node || node.isRestricted) {
    notFound();
  }

  const Component = templates[node.__typename] || templates.Page;
  const { template } = Component;
  
  const nodeData = await getTemplateDataByNode({
    template,
    node
  }); 

  const data = typeof template.transformer === 'function' ? template.transformer(nodeData?.data) : nodeData?.data;

  const breadcrumbs = Array.isArray(data.ancestors) ? [...data.ancestors] : [];
  
  breadcrumbs.reverse();

  return <Component data={data} breadcrumbs={breadcrumbs} />;
}