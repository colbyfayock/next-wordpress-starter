const fs = require('fs');
const { gql, ApolloClient, InMemoryCache } = require('@apollo/client');

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

module.exports.promiseToWriteFile = promiseToWriteFile;

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

module.exports.mkdirp = mkdirp;

async function getAllPosts(host, process) {
  const endpoint = `${host}/graphql`;

  const query = gql`
    {
      posts(first: 10000) {
        edges {
          node {
            title
            slug
            date
          }
        }
      }
    }
  `;

  const apolloClient = new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache(),
  });

  let posts = [];

  try {
    const data = await apolloClient.query({ query });
    posts = data.data.posts.edges.map(({ node = {} }) => node);
    console.log(`[${process}] Successfully fetched posts from ${endpoint}`);
  } catch (e) {
    console.log(`[${process}] Failed to fetch posts from ${endpoint}: ${e}`);
  } finally {
    return posts;
  }
}

module.exports.getAllPosts = getAllPosts;
