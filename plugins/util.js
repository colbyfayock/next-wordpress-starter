const fs = require('fs');
const he = require('he');
const { createGraphQLClient } = require('../src/lib/graphql-client');
const RSS = require('rss');

const config = require('../package.json');

/**
 * createFile
 */

async function createFile(file, process, directory, location, verbose = false) {
  try {
    mkdirp(directory);
    verbose && console.log(`[${process}] Created directory ${directory}`);
    await promiseToWriteFile(location, file);
    verbose && console.log(`[${process}] Successfully wrote file to ${location}`);
  } catch (e) {
    throw new Error(`[${process}] Failed to create file: ${e.message}`);
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
 * getAllPosts
 */

async function getAllPosts(graphqlClient, process, verbose = false) {
  const query = `
    {
      posts(first: 10000) {
        edges {
          node {
            title
            excerpt
            databaseId
            slug
            date
            modified
            author {
              node {
                name
                __typename
              }
              __typename
            }
            categories {
              edges {
                node {
                  name
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `;

  let posts = [];

  try {
    const data = await graphqlClient.query({ query });
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

    verbose && console.log(`[${process}] Successfully fetched posts from WordPress`);
    return {
      posts,
    };
  } catch (e) {
    throw new Error(`[${process}] Failed to fetch posts from WordPress: ${e.message}`);
  }
}

/**
 * getSiteMetadata
 */

async function getSiteMetadata(graphqlClient, process, verbose = false) {
  const query = `
    {
      generalSettings {
        description
        language
        title
        __typename
      }
    }
  `;

  let metadata = {};

  try {
    const data = await graphqlClient.query({ query });
    metadata = { ...data.data.generalSettings };

    if (!metadata.language || metadata.language === '') {
      metadata.language = 'en';
    } else {
      metadata.language = metadata.language.split('_')[0];
    }

    verbose && console.log(`[${process}] Successfully fetched metadata from WordPress`);
    return {
      metadata,
    };
  } catch (e) {
    throw new Error(`[${process}] Failed to fetch metadata from WordPress: ${e.message}`);
  }
}

/**
 * getSitePages
 */

async function getPages(graphqlClient, process, verbose = false) {
  const query = `
    {
      pages(first: 10000) {
        edges {
          node {
            slug
            modified
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `;

  let pages = [];

  try {
    const data = await graphqlClient.query({ query });
    pages = [
      ...data.data.pages.edges.map(({ node = {} }) => {
        return {
          slug: node.slug,
          modified: node.modified,
        };
      }),
    ];

    verbose && console.log(`[${process}] Successfully fetched page slugs from WordPress`);
    return {
      pages,
    };
  } catch (e) {
    throw new Error(`[${process}] Failed to fetch page slugs from WordPress: ${e.message}`);
  }
}

/**
 * getFeedData
 */

async function getFeedData(graphqlClient, process, verbose = false) {
  const metadata = await getSiteMetadata(graphqlClient, process, verbose);
  const posts = await getAllPosts(graphqlClient, process, verbose);

  return {
    ...metadata,
    ...posts,
  };
}

/**
 * getFeedData
 */

async function getSitemapData(graphqlClient, process, verbose = false) {
  const posts = await getAllPosts(graphqlClient, process, verbose);
  const pages = await getPages(graphqlClient, process, verbose);

  return {
    ...posts,
    ...pages,
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
 * getSitemapData
 */

function generateSitemap({ posts = [], pages = [] }, nextConfig = {}) {
  const { homepage = '' } = config;
  const { trailingSlash } = nextConfig;

  const slash = trailingSlash ? '/' : '';
  const entry = (loc, lastmod, priority) =>
    [
      '  <url>',
      `    <loc>${loc}</loc>`,
      ...(priority ? [`    <priority>${priority}</priority>`] : []),
      `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`,
      '  </url>',
    ].join('\n');

  // Written with fixed indentation instead of running an HTML formatter over the XML
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entry(homepage, Date.now()),
    ...pages.map((page) => entry(`${homepage}/${page.slug}${slash}`, page.modified, '0.3')),
    ...posts.map((post) => entry(`${homepage}/posts/${post.slug}${slash}`, post.modified)),
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * generateRobotsTxt
 */

async function generateRobotsTxt({ outputDirectory, outputName }) {
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
    await createFile(robots, 'Robots.txt', './public', './public/robots.txt');
  } catch (e) {
    throw new Error(`[Robots.txt] Failed to create robots.txt: ${e.message}`);
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
  createGraphQLClient,
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
