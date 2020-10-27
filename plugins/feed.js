const path = require('path');
const { getFeedData, generateFeed } = require('./util');

const WebpackPlugin = require('./plugin-compiler');

module.exports = function feed(nextConfig = {}) {
  const { env, outputDirectory, outputName } = nextConfig;

  const plugin = {
    name: 'Feed',
    outputDirectory: outputDirectory || './public',
    outputName: outputName || 'feed.xml',
    getData: getFeedData,
    generate: generateFeed,
  };

  const { WORDPRESS_HOST } = env;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (config.watchOptions) {
        config.watchOptions.ignored.push(path.join('**', plugin.outputDirectory, plugin.outputName));
      }

      config.plugins.push(
        new WebpackPlugin({
          host: WORDPRESS_HOST,
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
