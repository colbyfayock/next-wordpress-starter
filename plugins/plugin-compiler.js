const path = require('path');

const { createApolloClient, createFile } = require('./util');

class WebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  async index(compilation, options) {
    const { host, plugin } = options;

    plugin.outputLocation = path.join(plugin.outputDirectory, plugin.outputName);

    console.log(`[${plugin.name}] Compiling file ${plugin.outputLocation}`);

    if (typeof host !== 'string') {
      throw new Error(`[${plugin.name}] Failed to compile: invalid host type ${typeof host}`);
    }

    const apolloClient = createApolloClient(host);

    const data = await plugin.getData(apolloClient, plugin.name);

    const file = plugin.generate(data);

    await createFile(file, plugin.name, plugin.outputDirectory, plugin.outputLocation);
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
