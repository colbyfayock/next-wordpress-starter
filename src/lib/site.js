import WpRequest from 'models/wp-request';

/**
 * getSiteMetadata
 */

export async function getSiteMetadata() {
  const request = new WpRequest();

  const data = await request.fetch();

  return data;
}