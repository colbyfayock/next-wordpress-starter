const path = require('path');
const he = require('he');

const { promiseToWriteFile, mkdirp } = require('./util');

const PLUGIN_NAME = 'SearchIndex';
const WORDPRESS_API_POSTS = '/wp-json/wp/v2/posts';

class SearchIndexWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  async index(compilation, options) {
    const { host, outputDirectory, outputName } = options;

    const outputLocation = path.join(outputDirectory, outputName);

    console.log(`[${PLUGIN_NAME}] Compiling search index for ${host}; outputLocation: ${outputLocation}`);

    if (typeof host !== 'string') {
      throw new Error(`[${PLUGIN_NAME}] Failed to compile search index: invalid host type ${typeof host}`);
    }

    const postsUrl = `${host}${WORDPRESS_API_POSTS}`;

    const data = await fetch(postsUrl);
    const posts = await data.json();

    console.log(`[${PLUGIN_NAME}] Successfully fetched posts from ${postsUrl}`);

    const index = posts.map((post = {}) => {
      // We need to decode the title because we're using the
      // rendered version which assumes this value will be used
      // within the DOM

      const title = he.decode(post.title.rendered);

      return {
        title,
        slug: post.slug,
        date: post.date,
      };
    });

    try {
      const indexJson = JSON.stringify({
        generated: Date.now(),
        posts: index,
      });
      mkdirp(outputDirectory);
      console.log(`[${PLUGIN_NAME}] Created directory ${outputDirectory}`);
      await promiseToWriteFile(outputLocation, indexJson);
      console.log(`[${PLUGIN_NAME}] Successfully wrote index to ${outputLocation}`);
    } catch (e) {
      console.log(`[${PLUGIN_NAME}] Failed to index posts: ${e.message}`);
      throw e;
    }
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tap(PLUGIN_NAME, async (compilation) => await this.index(compilation, this.options));
  }
}

module.exports = SearchIndexWebpackPlugin;
