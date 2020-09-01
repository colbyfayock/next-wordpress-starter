module.exports = function indexSearch(nextConfig = {}) {
  const { env, outputLocation, outputName } = nextConfig;
  const { WORDPRESS_HOST } = env;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {

      config.module.rules.push({
        test: /.*/,
        use: [
          {
            loader: require.resolve('./search-index-loader'),
            options: {
              outputLocation,
              WORDPRESS_HOST
            }
          },
        ],
      });

      return config;
    }
  });

}