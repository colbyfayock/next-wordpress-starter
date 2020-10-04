const withPlugins = require('next-compose-plugins');

const indexSearch = require('./plugins/search-index');

module.exports = withPlugins([[indexSearch]], {
  env: {
    WORDPRESS_HOST: process.env.WORDPRESS_HOST,
  },
});
