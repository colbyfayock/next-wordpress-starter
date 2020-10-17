const withPlugins = require('next-compose-plugins');

const indexSearch = require('./plugins/search-index');

module.exports = withPlugins([[indexSearch]], {
  // By default, Next.js removes the trailing slash. One reason this would be good
  // to include is by default, the `path` property of the router for the homepage
  // is `/` and by using that, would instantly create a redirect

  trailingSlash: true,

  env: {
    WORDPRESS_HOST: process.env.WORDPRESS_HOST,
  },
});
