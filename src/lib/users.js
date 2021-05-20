import { getApolloClient } from 'lib/apollo-client';

import parameterize from 'parameterize';

import { QUERY_ALL_USERS, QUERY_ALL_USERS_SEO } from 'data/users';

// const ROLES_AUTHOR = ['author', 'administrator'];

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
 * authorPathByName
 */

export function authorPathByName(name) {
  return `/authors/${parameterize(name)}`;
}

/**
 * getUserByNameSlug
 */

export async function getUserByNameSlug(name) {
  const { users } = await getAllUsers();

  const user = users.find((user) => parameterize(user.name) === name);

  return {
    user,
  };
}

/**
 * userSlugByName
 */

export function userSlugByName(name) {
  return parameterize(name);
}

/**
 * getAllUsers
 */

export async function getAllUsers() {
  const apolloClient = getApolloClient();

  let usersData;
  let seoData;

  try {
    usersData = await apolloClient.query({
      query: QUERY_ALL_USERS,
    });
  } catch (e) {
    console.log(`[users][getAllUsers] Failed to query users data: ${e.message}`);
    throw e;
  }

  let users = usersData?.data.users.edges.map(({ node = {} }) => node).map(mapUserData);

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

  if (process.env.WORDPRESS_PLUGIN_SEO === true) {
    try {
      seoData = await apolloClient.query({
        query: QUERY_ALL_USERS_SEO,
      });
    } catch (e) {
      console.log(`[users][getAllUsers] Failed to query SEO plugin: ${e.message}`);
      console.log('Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.');
      throw e;
    }

    users = users.map((user) => {
      const data = { ...user };
      const { id } = data;

      const seo = seoData?.data?.users.edges.map(({ node = {} }) => node).find((node) => node.id === id)?.seo;

      return {
        ...data,
        title: seo.title,
        description: seo.metaDesc,
        robots: {
          nofollow: seo.metaRobotsNofollow,
          noindex: seo.metaRobotsNoindex,
        },
        social: seo.social,
      };
    });
  }

  return {
    users,
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
