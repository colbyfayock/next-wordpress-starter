const path = require('path');

const { createGraphQLClient, createFile, terminalColor, removeLastTrailingSlash } = require('./util');

const compilerClients = new WeakMap();

function getCompilerClient(compiler, url) {
  const endpoint = removeLastTrailingSlash(url);
  if (!compilerClients.has(compiler)) compilerClients.set(compiler, new Map());
  const clients = compilerClients.get(compiler);
  if (!clients.has(endpoint)) clients.set(endpoint, createGraphQLClient(endpoint));
  return clients.get(endpoint);
}

class WebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  async index(compilation, options) {
    const { url, plugin, verbose = false, nextConfig } = options;

    try {
      plugin.outputLocation = path.join(plugin.outputDirectory, plugin.outputName);

      verbose && console.log(`[${plugin.name}] Compiling file ${plugin.outputLocation}`);

      const hasUrl = typeof url === 'string';

      if (!hasUrl) {
        throw new Error(
          `[${plugin.name}] Failed to compile: Please check that WORDPRESS_GRAPHQL_ENDPOINT is set and configured in your environment. WORDPRESS_HOST is no longer supported by default.`
        );
      }

      const graphqlClient = getCompilerClient(compilation, url);

      const data = await plugin.getData(graphqlClient, plugin.name, verbose);

      const file = await plugin.generate(data, nextConfig);

      if (file !== false) {
        await createFile(file, plugin.name, plugin.outputDirectory, plugin.outputLocation, verbose);
      }

      //If there is an additional action to perform
      if (plugin.postcreate) {
        await plugin.postcreate(plugin);
      }

      !verbose && console.log(`Successfully created: ${terminalColor(plugin.outputName, 'info')}`);
    } catch (e) {
      console.error(`${terminalColor(e.message, 'error')}`);
      throw e;
    }
  }

  apply(compiler) {
    // We want this plugin to be able to run both during development mode and production
    // mode, but we also only want it to compile once. We need a way to be able to detect
    // some kind of identifier that will only be available once, where here we're using
    // the `main` entry. When these are ran, we check if that's in the active compiler
    // options and only run if it is

    const { plugin } = this.options;

    // Value to ensure that the plugins only run once and not continuously on every page request
    let hasRun = false;

    compiler.hooks.run.tapPromise(plugin.name, async (compiler) => {
      if (!compiler.options.entry.main || hasRun) return;

      await this.index(compiler, this.options);
      hasRun = true;
    });

    compiler.hooks.watchRun.tapPromise(plugin.name, async (compiler) => {
      const entries = await compiler.options.entry();
      if (!entries || !entries.main || hasRun) return;
      await this.index(compiler, this.options);
      hasRun = true;
    });
  }
}

module.exports = WebpackPlugin;
