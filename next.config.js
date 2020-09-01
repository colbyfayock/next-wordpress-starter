const withPlugins = require('next-compose-plugins');

const indexSearch = require('./plugins/search-index');

const WORDPRESS_HOST = 'http://54.243.240.9';

module.exports = withPlugins([
  // [indexSearch]
], {
  env: {
    WORDPRESS_HOST
  }
});