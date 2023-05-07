const pkg = require('./package.json');

const wordpressHost = process.env.WORDPRESS_GRAPHQL_ENDPOINT.replace(/https?:\/\//, '').split('/')[0];
const wordpressProtocol = process.env.WORDPRESS_GRAPHQL_ENDPOINT.split('://')[0];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: wordpressProtocol,
        hostname: wordpressHost
      },
    ],
  },
  
  reactStrictMode: true,
  swcMinify: true,

  // By default, Next.js removes the trailing slash. One reason this would be good
  // to include is by default, the `path` property of the router for the homepage
  // is `/` and by using that, would instantly create a redirect

  trailingSlash: true,

  // By enabling verbose logging, it will provide additional output details for
  // diagnostic purposes. By default is set to false.
  // verbose: true,

  env: {
    // The image directory for open graph images will be saved at the location above
    // with `public` prepended. By default, images will be saved at /public/images/og
    // and available at /images/og. If changing, make sure to update the .gitignore

    OG_IMAGE_DIRECTORY: '/images/og',

    // By default, only render this number of post pages ahead of time, otherwise
    // the rest will be rendered on-demand
    POSTS_PRERENDER_COUNT: 5,

    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    WORDPRESS_MENU_LOCATION_NAVIGATION: process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || 'PRIMARY',
    WORDPRESS_PLUGIN_SEO: parseEnvValue(process.env.WORDPRESS_PLUGIN_SEO, false),
    WORDPRESS_SITE_URL: pkg.homepage
  },
};

module.exports = nextConfig;

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
