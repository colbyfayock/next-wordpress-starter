import { getNodeByUri, getTemplateDataByNode } from '@/lib/nodes';

import { default as TemplatePage } from '@/templates/page';

const templates = {
  Page: TemplatePage,
};

export default async function Page({ params = {} }) {
  const { uriNodes } = params;

  let resolvedUri = null;

  if ( uriNodes) {
    resolvedUri = uriNodes.join('/');
  }

  const node = await getNodeByUri(resolvedUri)

  const Component = templates[node.__typename] || templates.Page;
  const { template } = Component;
  
  const nodeData = await getTemplateDataByNode({
    template,
    node
  }); 

  const data = typeof template.transformer === 'function' ? template.transformer(nodeData?.data) : nodeData?.data;

  return <Component data={data} />;
}

  // if (!node || node.isRestricted) {
  //   return {
  //     notFound: true,
  //   };
  // }

  // const breadcrumbs = Array.isArray(data.ancestors) ? [...data.ancestors] : [];
  // breadcrumbs.reverse();

  // return {
  //   props: {
  //     data,
  //     breadcrumbs,
  //   },
  // };