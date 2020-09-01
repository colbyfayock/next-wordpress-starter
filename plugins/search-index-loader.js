const path = require('path');
const fs = require('fs');
const { getOptions } = require('loader-utils');

const WORDPRESS_API_POSTS = '/wp-json/wp/v2/posts';

const DEFAULT_OUTPUT_DIRECTORY = './src/data';
const DEFAULT_OUTPUT_NAME = 'search.json';

module.exports = function(content, map, meta) {
  const callback = this.async();
  const options = getOptions(this);

  run(content, options).then((result) => {
    callback(null, result, map, meta);
  });
};

/**
 * run
 */

async function run(content, options = {}) {
  const {
    WORDPRESS_HOST,
    outputDirectory = DEFAULT_OUTPUT_DIRECTORY,
    outputName = DEFAULT_OUTPUT_NAME
  } = options;

  const outputLocation = path.join(outputDirectory, outputName);

  const data = await fetch(`${WORDPRESS_HOST}${WORDPRESS_API_POSTS}`);
  const posts = await data.json();

  const index = posts.map((post = {}) => {
    return {
      title: post.title.rendered,
      slug: post.slug,
      date: post.date
    }
  });

  try {
    const indexJson = JSON.stringify({
      generated: Date.now(),
      posts: index
    });
    mkdirp(outputDirectory);
    await promiseToWriteFile(outputLocation, indexJson);
  } catch(e) {
    console.log(`Failed to index posts: ${e.message}`);
    throw e;
  }

  return content
}

/**
 * promiseToWriteFile
 */

function promiseToWriteFile(location, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(location, content, (err) => {
      if ( err ) {
        reject(err);
        return;
      }
      resolve();
    })
  })
}

/**
 * mkdirp
 */

function mkdirp(directory) {
  const split = directory.split('/');
  let temp = '.';

  split.forEach((dir) => {
    temp = `${temp}/${dir}`;

    if (!fs.existsSync(temp) ) {
      fs.mkdirSync(temp);
    }
  });
}