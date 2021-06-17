const fs = require('fs');
const path = require('path');
const fabric = require('fabric').fabric;
const { getAllPosts, mkdirp } = require('./util');

const WebpackPluginCompiler = require('./plugin-compiler');

class SocialImagesPlugin extends WebpackPluginCompiler {
  constructor(options = {}) {
    super(options);
  }
}

const pkg = require('../package.json');

module.exports = function sitemap(nextConfig = {}) {
  const {
    env,
    outputDirectory = `./public${nextConfig.env.OG_IMAGE_DIRECTORY}`,
    outputName = '[slug].png',
    debug,
  } = nextConfig;

  // Reset properties to avoid shared configuration
  if (Object.prototype.hasOwnProperty.call(nextConfig, 'outputDirectory')) nextConfig.outputDirectory = undefined;
  if (Object.prototype.hasOwnProperty.call(nextConfig, 'outputName')) nextConfig.outputName = undefined;
  if (Object.prototype.hasOwnProperty.call(nextConfig, 'debug')) nextConfig.debug = undefined;

  const width = 1012;
  const height = 506;
  const padding = 50;

  const footerHeight = 50;

  const plugin = {
    name: 'SocialImages',
    outputDirectory,
    outputName,
    getData: getAllPosts,
    generate: ({ posts = [] }, logger) => {
      try {
        // Make sure our directory exists before outputting the files
        mkdirp(outputDirectory);

        posts.forEach((post) => {
          const { title, slug } = post;

          const canvas = new fabric.StaticCanvas(null, {
            width,
            height,
            backgroundColor: 'white',
          });

          const headlineWidth = (width / 3) * 2;
          const headlineHeight = height - padding * 2 - footerHeight;

          const headline = new fabric.Textbox(title, {
            left: (width - headlineWidth) / 2,
            top: height / 2 - footerHeight,
            originY: 'center',
            width: headlineWidth,
            height: headlineHeight,
            fill: '#303030',
            fontFamily: 'Arial',
            fontWeight: 600,
            fontSize: 60,
            lineHeight: 1,
            textAlign: 'center',
          });

          canvas.add(headline);

          const homepage = pkg.homepage && pkg.homepage.replace(/http(s)?:\/\//, '');

          if (homepage) {
            const website = new fabric.Textbox(homepage, {
              left: 0,
              top: height - padding / 2 - footerHeight,
              width,
              height: footerHeight,
              fill: '#303030',
              fontFamily: 'Arial',
              fontWeight: 600,
              fontSize: 30,
              textAlign: 'center',
            });

            canvas.add(website);
          }

          canvas.renderAll();

          const outputPath = path.join(outputDirectory, outputName.replace('[slug]', slug));
          const out = fs.createWriteStream(outputPath);
          const stream = canvas.createPNGStream();

          stream.on('data', function (chunk) {
            out.write(chunk);
          });
        });

        logger.log(`File generated`);
        return false;
      } catch (e) {
        throw new Error(`Failed to generate: ${e.message}`);
      }
    },
  };

  const { WORDPRESS_GRAPHQL_ENDPOINT } = env;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (config.watchOptions) {
        config.watchOptions.ignored.push(path.join('**', plugin.outputDirectory, plugin.outputName));
      }

      if (debug) {
        const regex = new RegExp(plugin.name);
        if (!config.infrastructureLogging?.debug) {
          config.infrastructureLogging = {
            debug: [regex],
          };
        } else {
          config.infrastructureLogging.debug.push(regex);
        }
      }

      config.plugins.push(
        new SocialImagesPlugin({
          url: WORDPRESS_GRAPHQL_ENDPOINT,
          plugin,
        })
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
