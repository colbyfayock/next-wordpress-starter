const fs = require('fs');
const he = require('he');
const { gql, ApolloClient, InMemoryCache } = require('@apollo/client');
const RSS = require('rss');
const prettier = require('prettier');

const config = require('../package.json');

/**
 * createFile
 */

async function createFile(file, directory, location, logger) {
  try {
    mkdirp(directory);
    logger.log(`Created directory ${directory}`);
    await promiseToWriteFile(location, file);
    logger.log(`Successfully wrote file to ${location}`);
  } catch (e) {
    throw new Error(`Failed to create file: ${e.message}`);
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

function createApolloClient(url) {
  return new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
  });
}

/**
 * getAllPosts
 */

async function getAllPosts(apolloClient, logger) {
  const query = gql`
    {
      posts(first: 10000) {
        edges {
          node {
            title
            excerpt
            postId
            slug
            date
            modified
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

      if (data.excerpt) {
        //Sanitize the excerpt by removing all HTML tags
        const regExHtmlTags = /(<([^>]+)>)/g;
        data.excerpt = data.excerpt.replace(regExHtmlTags, '');
      }

      return data;
    });

    logger.log(`Successfully fetched posts from ${apolloClient.link.options.uri}`);
    return {
      posts,
    };
  } catch (e) {
    throw new Error(`Failed to fetch posts from ${apolloClient.link.options.uri}: ${e.message}`);
  }
}

/**
 * getSiteMetadata
 */

async function getSiteMetadata(apolloClient, logger) {
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

    logger.log(`Successfully fetched metadata from ${apolloClient.link.options.uri}`);
    return {
      metadata,
    };
  } catch (e) {
    throw new Error(`Failed to fetch metadata from ${apolloClient.link.options.uri}: ${e.message}`);
  }
}

/**
 * getSitePages
 */

async function getPages(apolloClient, logger) {
  const query = gql`
    {
      pages(first: 10000) {
        edges {
          node {
            slug
            modified
          }
        }
      }
    }
  `;

  let pages = [];

  try {
    const data = await apolloClient.query({ query });
    pages = [
      ...data.data.pages.edges.map(({ node = {} }) => {
        return {
          slug: node.slug,
          modified: node.modified,
        };
      }),
    ];

    logger.log(`Successfully fetched page slugs from ${apolloClient.link.options.uri}`);
    return {
      pages,
    };
  } catch (e) {
    throw new Error(`Failed to fetch page slugs from ${apolloClient.link.options.uri}: ${e.message}`);
  }
}

/**
 * getFeedData
 */

async function getFeedData(apolloClient, logger) {
  const metadata = await getSiteMetadata(apolloClient, logger);
  const posts = await getAllPosts(apolloClient, logger);

  return {
    ...metadata,
    ...posts,
  };
}

/**
 * getFeedData
 */

async function getSitemapData(apolloClient, logger) {
  const posts = await getAllPosts(apolloClient, logger);
  const pages = await getPages(apolloClient, logger);

  return {
    ...posts,
    ...pages,
  };
}

/**
 * generateFeed
 */

function generateFeed({ posts = [], metadata = {} }, logger) {
  const { homepage = '' } = config;

  try {
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

    logger.log(`File generated`);

    return feed.xml({ indent: true });
  } catch (e) {
    throw new Error(`Failed to generate: ${e.message}`);
  }
}

/**
 * generateIndexSearch
 */

function generateIndexSearch({ posts }, logger) {
  try {
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

    logger.log(`File generated`);
    return indexJson;
  } catch (e) {
    throw new Error(`Failed to generate: ${e.message}`);
  }
}

/**
 * getSitemapData
 */

function generateSitemap({ posts = [], pages = [] }, logger) {
  try {
    const { homepage = '' } = config;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${homepage}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
        ${pages
          .map((page) => {
            return `<url>
                      <loc>${homepage}/${page.slug}</loc>
                      <priority>0.3</priority>
                      <lastmod>${new Date(page.modified).toISOString()}</lastmod>
                    </url>
                `;
          })
          .join('')}
          ${posts
            .map((post) => {
              return `<url>
                        <loc>${homepage}/posts/${post.slug}</loc>
                        <lastmod>${new Date(post.modified).toISOString()}</lastmod>
                      </url>
                  `;
            })
            .join('')}
    </urlset>
    `;

    const sitemapFormatted = prettier.format(sitemap, {
      printWidth: 120,
      parser: 'html',
    });

    logger.log(`File generated`);
    return sitemapFormatted;
  } catch (e) {
    throw new Error(`Failed to generate: ${e.message}`);
  }
}

/**
 * generateRobotsTxt
 */

async function generateRobotsTxt({ outputDirectory, outputName }, logger) {
  const { homepage = '' } = config;

  try {
    // Build sitemap URL at root directory
    let sitemapUrl = new URL(outputName, homepage);

    // Check if output directory is not root directory
    if (outputDirectory !== './public') {
      // Check if output directory is within './public' folder
      if (outputDirectory.startsWith('./public')) {
        // Update sitemap URL with new directory
        sitemapUrl.pathname = resolvePublicPathname(outputDirectory, outputName);
      } else {
        throw new Error('Sitemap should be within ./public folder.');
      }
    }

    // Robots content using sitemap final URL
    const robots = `User-agent: *\nSitemap: ${sitemapUrl}`;

    // Create robots.txt always at root directory
    await createFile(robots, './public', './public/robots.txt', logger);
  } catch (e) {
    throw new Error(`Failed to generate robots.txt: ${e.message}`);
  }
}

/**
 * resolvePathname
 */

function resolvePublicPathname(outputDirectory, outputName) {
  const directory = outputDirectory.split('/');
  const index = directory.indexOf('public');
  const path = directory
    .map((path, i) => {
      // If actual folder is a 'public' direct subfolder and is not empty, add to pathname
      if (i > index && path) {
        return `/${path}`;
      }
    })
    .join('');

  return `${path}/${outputName}`;
}

/**
 * removeLastTrailingSlash
 */

function removeLastTrailingSlash(url) {
  if (typeof url !== 'string') return url;
  return url.replace(/\/$/, '');
}

/**
 * terminalColor
 */

function terminalColor(text, level) {
  switch (level) {
    /** green */
    case 'info':
    default:
      return `\x1b[32m${text}\x1b[0m`;
    /** yellow */
    case 'warn':
      return `\x1b[33m${text}\x1b[0m`;
    /** red */
    case 'error':
      return `\x1b[31m${text}\x1b[0m`;
  }
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
  getPages,
  getSitemapData,
  generateSitemap,
  generateRobotsTxt,
  removeLastTrailingSlash,
  resolvePublicPathname,
  terminalColor,
};
