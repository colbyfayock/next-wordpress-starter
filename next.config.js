const withPlugins = require('next-compose-plugins');

const indexSearch = require('./plugins/search-index');
const feed = require('./plugins/feed');
const sitemap = require('./plugins/sitemap');
const socialImages = require('./plugins/socialImages');

// Temporary fix for issue with Vercel builds where node-canvas via fabric creates issues
// @via https://github.com/Automattic/node-canvas/issues/1779#issuecomment-895885846

const LD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH;
const CANVAS_RELEASE_PATH = `${process.env.PWD}/node_modules/canvas/build/Release`;

if (LD_LIBRARY_PATH === null || (LD_LIBRARY_PATH && !LD_LIBRARY_PATH.includes(CANVAS_RELEASE_PATH))) {
  process.env.LD_LIBRARY_PATH = `${CANVAS_RELEASE_PATH}:${LD_LIBRARY_PATH || ''}`;
}

module.exports = withPlugins([[indexSearch], [feed], [sitemap], [socialImages]], {
  // By default, Next.js removes the trailing slash. One reason this would be good
  // to include is by default, the `path` property of the router for the homepage
  // is `/` and by using that, would instantly create a redirect

  trailingSlash: true,

  // By enabling verbose logging, it will provide additional output details for
  // diagnostic purposes. By default is set to false.
  // verbose: true,

  env: {
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    WORDPRESS_MENU_LOCATION_NAVIGATION: process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || 'PRIMARY',
    WORDPRESS_PLUGIN_SEO: parseEnvValue(process.env.WORDPRESS_PLUGIN_SEO, false),

    // The image directory for open graph images will be saved at the location above
    // with `public` prepended. By default, images will be saved at /public/images/og
    // and available at /images/og. If changing, make sure to update the .gitignore

    OG_IMAGE_DIRECTORY: '/images/og',
  },
});

/**
 * parseEnv
 * @description Helper function to check if a variable is defined and parse booelans
 */

function parseEnvValue(value, defaultValue) {
  if (typeof value === 'undefined') return defaultValue;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return value;
}
