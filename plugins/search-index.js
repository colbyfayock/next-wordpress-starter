const SearchIndexWebpackPlugin = require("./search-index-compiler");

module.exports = function indexSearch(nextConfig = {}) {
  const { env, outputLocation, outputName } = nextConfig;
  const { WORDPRESS_HOST } = env;

  return Object.assign({}, nextConfig, {
    webpack(config) {
      config.plugins.push(new SearchIndexWebpackPlugin({
        host: WORDPRESS_HOST,
        outputLocation,
        outputName
      }));

      return config;
    }
  });

}