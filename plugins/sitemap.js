const path = require('path');
const { getSitemapData, generateSitemap, generateRobotsTxt } = require('./util');

const WebpackPluginCompiler = require('./plugin-compiler');

module.exports = function sitemap(nextConfig = {}) {
  const { env, outputDirectory, outputName, verbose = false } = nextConfig;

  const plugin = {
    name: 'Sitemap',
    outputDirectory: outputDirectory || './public',
    outputName: outputName || 'sitemap.xml',
    getData: getSitemapData,
    generate: generateSitemap,
    postcreate: generateRobotsTxt,
  };

  const { WORDPRESS_GRAPHQL_ENDPOINT } = env;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (config.watchOptions) {
        config.watchOptions.ignored.push(path.join('**', plugin.outputDirectory, plugin.outputName));
      }

      config.plugins.push(
        new WebpackPluginCompiler({
          url: WORDPRESS_GRAPHQL_ENDPOINT,
          plugin,
          verbose,
        })
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
