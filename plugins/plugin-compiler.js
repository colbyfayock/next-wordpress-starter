const path = require('path');

const { createApolloClient, createFile, removeLastTrailingSlash } = require('./util');

class WebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  async index(compilation, options) {
    const { url, plugin } = options;
    const logger = compilation.getInfrastructureLogger(plugin.name);

    try {
      plugin.outputLocation = path.join(plugin.outputDirectory, plugin.outputName);
      logger.log(`Compiling file ${plugin.outputLocation}`);

      const hasUrl = typeof url === 'string';

      if (!hasUrl) {
        throw new Error(
          `Failed to compile: Please check that WORDPRESS_GRAPHQL_ENDPOINT is set and configured in your environment. WORDPRESS_HOST is no longer supported by default.`
        );
      }

      const apolloClient = createApolloClient(removeLastTrailingSlash(url));

      const data = await plugin.getData(apolloClient, logger);

      const file = plugin.generate(data, logger);

      if (file !== false) {
        await createFile(file, plugin.outputDirectory, plugin.outputLocation, logger);
      }

      //If there is an aditional action to perform
      if (plugin.postcreate) {
        await plugin.postcreate(plugin, logger);
      }

      logger.info(`Successfully created: ${plugin.outputName}`);
    } catch (e) {
      logger.error(e.message);
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
