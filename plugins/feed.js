const path = require('path');
const { getFeedData, generateFeed } = require('./util');

const WebpackPluginCompiler = require('./plugin-compiler');

class FeedPlugin extends WebpackPluginCompiler {
  constructor(options = {}) {
    super(options);
  }
}

module.exports = function feed(nextConfig = {}) {
  const { env, outputDirectory, outputName, debug } = nextConfig;

  const plugin = {
    name: 'Feed',
    outputDirectory: outputDirectory || './public',
    outputName: outputName || 'feed.xml',
    getData: getFeedData,
    generate: generateFeed,
  };

  // Reset properties to avoid shared configuration
  if (Object.prototype.hasOwnProperty.call(nextConfig, 'outputDirectory')) nextConfig.outputDirectory = undefined;
  if (Object.prototype.hasOwnProperty.call(nextConfig, 'outputName')) nextConfig.outputName = undefined;
  if (Object.prototype.hasOwnProperty.call(nextConfig, 'debug')) nextConfig.debug = undefined;

  const { WORDPRESS_GRAPHQL_ENDPOINT } = env;
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (config.watchOptions) {
        config.watchOptions.ignored.push(path.join('**', plugin.outputDirectory, plugin.outputName));
      }

      if (debug) {
        const regex = new RegExp(plugin.name);
        if (!config.infrastructureLogging?.debug) {
          config.infrastructureLogging = {
            debug: [regex],
          };
        } else {
          config.infrastructureLogging.debug.push(regex);
        }
      }

      config.plugins.push(
        new FeedPlugin({
          url: WORDPRESS_GRAPHQL_ENDPOINT,
          plugin,
        })
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
