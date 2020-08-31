const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const WORDPRESS_HOST = 'http://54.243.240.9';
const WORDPRESS_UPLOADS = '/wp-content/uploads';

function wordpressImages(nextConfig = {}, nextComposePlugins = {}) {
  const { env } = nextConfig;
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(js)$/,
        use: [
          {
            loader: require.resolve('./images-loader'),
            options: {
              ...env
            }
          },
        ],
      });

      return config;
    }
  });
}

module.exports = withPlugins([
  [wordpressImages],
  [optimizedImages]
], {
  env: {
    WORDPRESS_HOST,
    WORDPRESS_UPLOADS
  }
});