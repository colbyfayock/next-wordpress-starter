const path = require('path');
const he = require('he');

const { promiseToWriteFile, mkdirp, getAllPosts } = require('./util');

const PLUGIN_NAME = 'SearchIndex';

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

    const posts = await getAllPosts(host, PLUGIN_NAME);

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
    // We want this plugin to be able to run both during development mode and production
    // mode, but we also only want it to compile once. We need a way to be able to detect
    // some kind of identifier that will only be available once, where here we're using
    // the `main` entry. When these are ran, we check if that's in the active compiler
    // options and only run if it is

    compiler.hooks.run.tap(PLUGIN_NAME, async (compiler) => {
      if (!compiler.options.entry.main) return;
      await this.index(compiler, this.options);
    });

    compiler.hooks.watchRun.tap(PLUGIN_NAME, async (compiler) => {
      const entries = await compiler.options.entry();
      if (!entries || !entries.main) return;
      await this.index(compiler, this.options);
    });
  }
}

module.exports = SearchIndexWebpackPlugin;
