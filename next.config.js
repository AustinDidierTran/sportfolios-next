const withPlugins = require('next-compose-plugins');

const withWorkbox = require('next-with-workbox');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
if (process.argv[2] === 'dev') {
  module.exports = withPlugins([
    [withBundleAnalyzer],
    [
      withWorkbox,
      {
        workbox: {
          swDest: '/sw.js',
          swSrc: '/worker.js',
          force: false,
        },
        swcMinify: true,
      },
    ],
  ]);
}
else {
  module.exports = withPlugins([
    [withBundleAnalyzer],
    [
      withWorkbox,
      {
        workbox: {
          swDest: '/sw.js',
          swSrc: '/worker.js',
          force: false,
        },
        swcMinify: false,
      },
    ],
  ]);
}


