import { getApolloClient } from 'lib/apollo-client';

import { QUERY_ALL_USERS } from 'data/users';

const ROLES_AUTHOR = ['author', 'administrator'];

/**
 * postPathBySlug
 */

export function authorPathBySlug(slug) {
  return `/authors/${slug}`;
}

/**
 * getUserBySlug
 */

export async function getUserBySlug(slug) {
  const { users } = await getAllUsers();

  const user = users.find((user) => user.slug === slug);

  return {
    user,
  };
}

/**
 * getAllUsers
 */

export async function getAllUsers() {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: QUERY_ALL_USERS,
  });

  const users = data?.data.users.edges.map(({ node = {} }) => node);

  return {
    users: Array.isArray(users) && users.map(mapUserData),
  };
}

/**
 * getAllAuthors
 */

export async function getAllAuthors() {
  const { users } = await getAllUsers();

  // TODO: Roles aren't showing in response - we should be filtering here

  // const authors = users.filter(({ roles }) => {
  //   const userRoles = roles.map(({ name }) => name);
  //   const authorRoles = userRoles.filter(role => ROLES_AUTHOR.includes(role));
  //   return authorRoles.length > 0;
  // });

  return {
    authors: users,
  };
}

/**
 * mapUserData
 */

export function mapUserData(user) {
  return {
    ...user,
    roles: [...user.roles.nodes],
    avatar: user.avatar && updateUserAvatar(user.avatar),
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
