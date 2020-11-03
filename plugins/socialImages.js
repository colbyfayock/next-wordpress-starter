const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const { getAllPosts } = require('./util');

const WebpackPlugin = require('./plugin-compiler');

module.exports = function sitemap(nextConfig = {}) {
  const { env, outputDirectory = './public', outputName } = nextConfig;

  const plugin = {
    name: 'Sitemap',
    outputDirectory: outputDirectory,
    outputName: outputName || 'sitemap.jpg',
    getData: getAllPosts,
    generate: ({ posts = [] }) => {

      posts.forEach((post) => {
        const { title, slug } = post;

        var canvas = Canvas.createCanvas(2000, 1000);
        var ctx = canvas.getContext('2d');

        ctx.globalAlpha = 0.2;

        ctx.globalAlpha = 1;
        ctx.font = 'normal 40px Impact, serif';

        ctx.translate(20, -40);

        ctx.fillStyle = '#000';
        ctx.fillText(title, 49, 99);


        canvas.createPNGStream().pipe(fs.createWriteStream(path.join(outputDirectory, 'images', `${slug}.png`)));
      })


      console.log('posts', posts);
    }
  };

  const { WORDPRESS_HOST } = env;

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (config.watchOptions) {
        config.watchOptions.ignored.push(path.join('**', plugin.outputDirectory, plugin.outputName));
      }

      config.plugins.push(
        new WebpackPlugin({
          host: WORDPRESS_HOST,
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
