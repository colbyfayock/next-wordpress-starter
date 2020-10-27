const withPlugins = require('next-compose-plugins');
const { removeLastTrailingSlash } = require('./plugins/util');

const indexSearch = require('./plugins/search-index');
const feed = require('./plugins/feed');

module.exports = withPlugins([[indexSearch], [feed]], {
  // By default, Next.js removes the trailing slash. One reason this would be good
  // to include is by default, the `path` property of the router for the homepage
  // is `/` and by using that, would instantly create a redirect

  trailingSlash: true,

  env: {
    WORDPRESS_HOST: removeLastTrailingSlash(process.env.WORDPRESS_HOST),
  },
});
