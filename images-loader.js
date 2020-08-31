const path = require('path');
const fs = require('fs');
const request = require('request');
const { getOptions } = require('loader-utils');

const DEFAULT_REQUIRE_DIRECTORY = 'images/wp-content';
const DEFAULT_OUTPUT_DIRECTORY = path.join('./src/', DEFAULT_REQUIRE_DIRECTORY);

let regex;

async function run(content, options = {}) {
  const { WORDPRESS_HOST, WORDPRESS_UPLOADS } = options;
  const uriPrefix = `${WORDPRESS_HOST}${WORDPRESS_UPLOADS}`;

  if ( !regex ) {
    regex = new RegExp('src=\"' + uriPrefix + '\/.+\.(jpe?g|png|svg|gif|ico|webp|jp2)\"', 'ig');
  }

  const matches = content.match(regex);
  // const wordpressMatches = content.match(new RegExp('data-wordpress', 'g'));

  // if ( Array.isArray(wordpressMatches) ) {
  //   content.match(new RegExp('data-wordpress', 'g')).map(match => {
  //     content = content.replace(/src={(.+)}/, "src={require($1)}");
  //   });
  // }

  if ( !Array.isArray(matches) ) return content;
  console.log('matches', matches)

  await Promise.all(matches.map(async match => {
    const uri = match.substring(0, match.length - 1).replace('src="', '');
    const uriNoPrefix = uri.replace(uriPrefix, '');
    const outputLocation = path.join(DEFAULT_OUTPUT_DIRECTORY, uriNoPrefix);
    const outputDirectory = path.dirname(outputLocation);
    const requireLocation = path.join(DEFAULT_REQUIRE_DIRECTORY, uriNoPrefix);

    mkdirp(outputDirectory);

    await download(uri, outputLocation);

    content = content.replace(new RegExp(match, 'g'), `src={require('${requireLocation}')}`);
  }));

  return content
}


module.exports = function(content, map, meta) {
  const callback = this.async();
  const options = getOptions(this);

  run(content, options).then((result) => {
    callback(null, result, map, meta);
  });
};


/**
 * mkdirp
 */

function mkdirp(directory) {
  const split = directory.split('/');
  let temp = '.';

  split.forEach((dir) => {
    temp = `${temp}/${dir}`;

    if (!fs.existsSync(temp) ) {
      fs.mkdirSync(temp);
    }
  });
}

/**
 * download
 */

function download(uri, outputPath){
  return new Promise((resolve, reject) => {
    request.head(uri, function(err, res, body){
      if ( err ) {
        reject(err);
        return;
      }
      request(uri).pipe(fs.createWriteStream(outputPath)).on('close', (data) => {
        resolve(data);
      });
    });
  })
};