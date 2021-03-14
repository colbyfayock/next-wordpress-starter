const withPlugins = require('next-compose-plugins');
const { removeLastTrailingSlash } = require('./plugins/util');

const indexSearch = require('./plugins/search-index');
const feed = require('./plugins/feed');
const sitemap = require('./plugins/sitemap');
const socialImages = require('./plugins/socialImages');

module.exports = withPlugins([[indexSearch], [feed], [sitemap], [socialImages]], {
  // By default, Next.js removes the trailing slash. One reason this would be good
  // to include is by default, the `path` property of the router for the homepage
  // is `/` and by using that, would instantly create a redirect

  trailingSlash: true,

  // By enabling verbose logging, it will provide additional output details for
  // diagnostic purposes. By default is set to false.
  // verbose: true,

  env: {
    WORDPRESS_HOST: removeLastTrailingSlash(process.env.WORDPRESS_HOST),
    WORDPRESS_GRAPHQL_ENDPOINT: removeLastTrailingSlash(process.env.WORDPRESS_GRAPHQL_ENDPOINT),

    // By default, the number of posts per page used in pagination is 10.
    // This can be modified by setting the variable POSTS_PER_PAGE to a
    // custom number.
    // POSTS_PER_PAGE: 10,
  },
});
