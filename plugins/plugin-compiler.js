const path = require('path');

const { createApolloClient, createFile, terminalColor } = require('./util');

const DEFAULT_GRAPHQL_PATH = '/graphql';

class WebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  async index(compilation, options) {
    const { url, host, plugin, verbose = false } = options;
    let endpoint = url;

    if (!endpoint && host) {
      endpoint = `${host}${DEFAULT_GRAPHQL_PATH}`;
    }

    try {
      plugin.outputLocation = path.join(plugin.outputDirectory, plugin.outputName);

      verbose && console.log(`[${plugin.name}] Compiling file ${plugin.outputLocation}`);

      const hasUrl = typeof url === 'string';
      const hasHost = typeof host === 'string';

      if (!hasUrl && !hasHost) {
        throw new Error(
          `[${plugin.name}] Failed to compile: Please check that either WORDPRESS_GRAPHQL_ENDPOINT or WORDPRESS_HOST is set and configured properly.`
        );
      }

      const apolloClient = createApolloClient(endpoint);

      const data = await plugin.getData(apolloClient, plugin.name, verbose);

      const file = plugin.generate(data);

      if (file !== false) {
        await createFile(file, plugin.name, plugin.outputDirectory, plugin.outputLocation, verbose);
      }

      //If there is an aditional action to perform
      if (!!plugin.postcreate) {
        plugin.postcreate(plugin);
      }

      !verbose && console.log(`Successfully created: ${terminalColor(plugin.outputName, 'info')}`);
    } catch (e) {
      console.error(`${terminalColor(e.message, 'error')}`);
    }
  }

  apply(compiler) {
    // We want this plugin to be able to run both during development mode and production
    // mode, but we also only want it to compile once. We need a way to be able to detect
    // some kind of identifier that will only be available once, where here we're using
    // the `main` entry. When these are ran, we check if that's in the active compiler
    // options and only run if it is

    const { plugin } = this.options;

    compiler.hooks.run.tap(plugin.name, async (compiler) => {
      if (!compiler.options.entry.main) return;
      await this.index(compiler, this.options);
    });

    compiler.hooks.watchRun.tap(plugin.name, async (compiler) => {
      const entries = await compiler.options.entry();
      if (!entries || !entries.main) return;
      await this.index(compiler, this.options);
    });
  }
}

module.exports = WebpackPlugin;
