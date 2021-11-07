const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

const { getAllPosts, mkdirp } = require('./util');
const WebpackPluginCompiler = require('./plugin-compiler');

const pkg = require('../package.json');

module.exports = function socialImages(nextConfig = {}) {
  const {
    env,
    outputDirectory = `./public${nextConfig.env.OG_IMAGE_DIRECTORY}`,
    outputName = '[slug].png',
    verbose = false,
  } = nextConfig;

  const width = 1012;
  const height = 506;

  const plugin = {
    name: 'SocialImages',
    outputDirectory,
    outputName,
    getData: getAllPosts,
    generate: async ({ posts = [] }) => {
      mkdirp(outputDirectory);

      const homepage = pkg.homepage && pkg.homepage.replace(/http(s)?:\/\//, '');
      const template = await fs.readFile('./plugins/socialImages.template.html', 'utf8');

      const browser = await chromium.launch();

      await Promise.all(
        posts.map(async (post) => {
          const { title, slug } = post;
          let html = template;

          html = html.replace('{{ title }}', title);
          html = html.replace('{{ homepage }}', homepage);

          const page = await browser.newPage();
          await page.setViewportSize({ width, height });
          await page.setContent(html);
          await page.screenshot({ path: `${outputDirectory}/${slug}.png` });
          await page.close();
        })
      );

      await browser.close();

      return false;
    },
  };

  const { WORDPRESS_GRAPHQL_ENDPOINT } = env;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (config.watchOptions) {
        config.watchOptions.ignored.push(path.join('**', plugin.outputDirectory, plugin.outputName));
      }

      config.plugins.push(
        new WebpackPluginCompiler({
          url: WORDPRESS_GRAPHQL_ENDPOINT,
          plugin,
          verbose,
        })
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
