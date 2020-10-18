const path = require('path');

const SearchIndexWebpackPlugin = require('./search-index-compiler');

const DEFAULT_OUTPUT_DIRECTORY = './public';
const DEFAULT_OUTPUT_NAME = 'wp-search.json';

module.exports = function indexSearch(nextConfig = {}) {
  const { env, outputDirectory = DEFAULT_OUTPUT_DIRECTORY, outputName = DEFAULT_OUTPUT_NAME } = nextConfig;
  const { WORDPRESS_HOST } = env;

  return Object.assign({}, nextConfig, {
    webpack(config) {
      // Ignore the search index in the filesystem to avoid a loop of changes

      if (config.watchOptions) {
        config.watchOptions.ignored.push(path.join('**', outputDirectory, outputName));
      }

      config.plugins.push(
        new SearchIndexWebpackPlugin({
          host: WORDPRESS_HOST,
          outputDirectory,
          outputName,
        })
      );

      return config;
    },
  });
};
