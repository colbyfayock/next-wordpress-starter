import WpRequest from 'models/wp-request';

/**
 * getSiteMetadata
 */

export async function getSiteMetadata() {
  const request = new WpRequest({
    route: '?_fields=name,description',
  });

  const { data } = await request.fetch();

  return data;
}
