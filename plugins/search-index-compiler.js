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

    if (typeof host !== 'string') {
      throw new Error(`Failed to compile search index: invalid host type ${typeof host}`);
    }

    const outputLocation = path.join(outputDirectory, outputName);

    const data = await fetch(`${host}${WORDPRESS_API_POSTS}`);
    const posts = await data.json();

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
      await promiseToWriteFile(outputLocation, indexJson);
    } catch (e) {
      console.log(`Failed to index posts: ${e.message}`);
      throw e;
    }
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tap(PLUGIN_NAME, async (compilation) => await this.index(compilation, this.options));
  }
}

module.exports = SearchIndexWebpackPlugin;
