const fs = require('fs');
const he = require('he');
const { gql, ApolloClient, InMemoryCache } = require('@apollo/client');
const RSS = require('rss');
const config = require('../package.json');

/**
 * createFile
 */

async function createFile(file, process, directory, location) {
  try {
    mkdirp(directory);
    console.log(`[${process}] Created directory ${directory}`);
    await promiseToWriteFile(location, file);
    console.log(`[${process}] Successfully wrote file to ${location}`);
  } catch (e) {
    console.log(`[${process}] Failed to create file: ${e.message}`);
    throw e;
  }
}

/**
 * promiseToWriteFile
 */

function promiseToWriteFile(location, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(location, content, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

/**
 * mkdirp
 */

function mkdirp(directory) {
  const split = directory.split('/');
  let temp = '.';

  split.forEach((dir) => {
    temp = `${temp}/${dir}`;

    if (!fs.existsSync(temp)) {
      fs.mkdirSync(temp);
    }
  });
}

/**
 * createApolloClient
 */

function createApolloClient(host) {
  return new ApolloClient({
    uri: `${host}/graphql`,
    cache: new InMemoryCache(),
  });
}

/**
 * getAllPosts
 */

async function getAllPosts(apolloClient, process) {
  const query = gql`
    {
      posts(first: 10000) {
        edges {
          node {
            title
            postId
            slug
            date
            author {
              node {
                name
              }
            }
            categories {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  let posts = [];

  try {
    const data = await apolloClient.query({ query });
    const nodes = [...data.data.posts.edges.map(({ node = {} }) => node)];

    posts = nodes.map((post) => {
      const data = { ...post };

      if (data.author) {
        data.author = data.author.node.name;
      }

      if (data.categories) {
        data.categories = data.categories.edges.map(({ node }) => node.name);
      }

      return data;
    });

    console.log(`[${process}] Successfully fetched posts from ${apolloClient.link.options.uri}`);
  } catch (e) {
    console.log(`[${process}] Failed to fetch posts from ${apolloClient.link.options.uri}: ${e}`);
  } finally {
    return {
      posts,
    };
  }
}

/**
 * getSiteMetadata
 */

async function getSiteMetadata(apolloClient, process) {
  const query = gql`
    {
      generalSettings {
        description
        language
        title
      }
    }
  `;

  let metadata = {};

  try {
    const data = await apolloClient.query({ query });
    metadata = { ...data.data.generalSettings };

    if (!metadata.language || metadata.language === '') {
      metadata.language = 'en';
    } else {
      metadata.language = metadata.language.split('_')[0];
    }

    console.log(`[${process}] Successfully fetched metadata from ${apolloClient.link.options.uri}`);
  } catch (e) {
    console.log(`[${process}] Failed to fetch metadata from ${apolloClient.link.options.uri}: ${e}`);
  } finally {
    return {
      metadata,
    };
  }
}

/**
 * getFeedData
 */

async function getFeedData(apolloClient, process) {
  const metadata = await getSiteMetadata(apolloClient, process);
  const posts = await getAllPosts(apolloClient, process);

  return {
    ...metadata,
    ...posts,
  };
}

/**
 * generateFeed
 */

function generateFeed({ posts = [], metadata = {} }) {
  const { homepage = '' } = config;

  const feed = new RSS({
    title: metadata.title || '',
    description: metadata.description,
    site_url: homepage,
    feed_url: `${homepage}/feed.xml`,
    copyright: `${new Date().getFullYear()} ${metadata.title}`,
    language: metadata.language,
    pubDate: new Date(),
  });

  posts.map((post) => {
    feed.item({
      title: post.title,
      guid: `${homepage}/posts/${post.slug}`,
      url: `${homepage}/posts/${post.slug}`,
      date: post.date,
      description: post.excerpt,
      author: post.author,
      categories: post.categories || [],
    });
  });

  return feed.xml({ indent: true });
}

/**
 * generateIndexSearch
 */

function generateIndexSearch({ posts }) {
  const index = posts.map((post = {}) => {
    // We need to decode the title because we're using the
    // rendered version which assumes this value will be used
    // within the DOM

    const title = he.decode(post.title);

    return {
      title,
      slug: post.slug,
      date: post.date,
    };
  });

  const indexJson = JSON.stringify({
    generated: Date.now(),
    posts: index,
  });

  return indexJson;
}

/**
 * removeLastTrailingSlash
 */

function removeLastTrailingSlash(url) {
  return url.replace(/\/$/, '');
}

module.exports = {
  createFile,
  promiseToWriteFile,
  mkdirp,
  createApolloClient,
  getAllPosts,
  getSiteMetadata,
  getFeedData,
  generateFeed,
  generateIndexSearch,
  removeLastTrailingSlash,
};
