import { ImageResponse } from 'next/server';

import { getSiteMetadata } from '@/lib/site';
import { getNodeByUri, getTemplateDataByNode } from '@/lib/nodes';

import { templates } from '@/app/[...uriNodes]/page';

export const runtime = 'edge';

export const alt = 'About Acme';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export async function GET(request, { params }) {
  const resolvedUri = `/${params.path.join('/')}`;
  const node = await getNodeByUri(resolvedUri);

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

  let website = metadata.url.replace(/https?:\/\//, '');

  if (website[website.length - 1] === '/') {
    website = website.slice(0, website.length - 1);
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            paddingRight: 50,
            paddingLeft: 50,
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 50,
              textAlign: 'center',
            }}
          >
            {data.title}
          </div>
        </div>
        <div
          style={{
            fontSize: 30,
            paddingTop: 40,
            paddingBottom: 40,
          }}
        >
          {website}
        </div>
      </div>
    ),
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageReponse's width and height.
      ...size,
    }
  );
}
