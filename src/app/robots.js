import { getSiteMetadata } from '@/lib/site';

export default async function robots() {
  const metadata = await getSiteMetadata();

  return {
    rules: {
      userAgent: '*',
    },
    sitemap: `${metadata.url}/sitemap.xml`,
  };
}
