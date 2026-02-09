import { gql } from '@/lib/request';

import { QUERY_ALL_USERS } from '@/data/users';

/**
 * getAllUsers
 */

export async function getAllUsers() {
  const data = await gql({
    query: QUERY_ALL_USERS,
  });

  const users = data?.data.users.edges.map(({ node = {} }) => node);

  return {
    users,
  };
}

/**
 * updateUserAvatar
 */

export function updateUserAvatar(avatar) {
  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  return {
    ...avatar,
    url: avatar.url?.replace('http://', 'https://'),
  };
}
