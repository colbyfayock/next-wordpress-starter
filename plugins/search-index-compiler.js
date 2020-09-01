const path = require('path');

const { promiseToWriteFile, mkdirp } = require('./util');

const PLUGIN_NAME = 'SearchIndex';
const WORDPRESS_API_POSTS = '/wp-json/wp/v2/posts';
const DEFAULT_OUTPUT_DIRECTORY = './public';
const DEFAULT_OUTPUT_NAME = 'search.json';

class SearchIndexWebpackPlugin {

  constructor(options = {}) {
    this.options = options;
  }

  async index(compilation, options) {
    const {
      host,
      outputDirectory = DEFAULT_OUTPUT_DIRECTORY,
      outputName = DEFAULT_OUTPUT_NAME
    } = options;

    if ( typeof host !== 'string' ) {
      throw new Error(`Failed to compile search index: invalid host type ${typeof host}`);
    }

    const outputLocation = path.join(outputDirectory, outputName);

    const data = await fetch(`${host}${WORDPRESS_API_POSTS}`);
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
  }

  apply(compiler) {
    // Runs on build (next build)

    compiler.hooks.run.tap(PLUGIN_NAME, async (compilation) => await this.index(compilation, this.options));

    // Runs on develop (next dev)

    compiler.hooks.watchRun.tap(PLUGIN_NAME, async (compilation) => await this.index(compilation, this.options));
  }

}

module.exports = SearchIndexWebpackPlugin;