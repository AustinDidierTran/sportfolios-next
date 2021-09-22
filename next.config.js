const withPlugins = require('next-compose-plugins');

const withWorkbox = require('next-with-workbox');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins(
  [
    [withBundleAnalyzer],
    [
      withWorkbox,
      {
        workbox: {
          swDest: '/sw.js',
          swSrc: '/worker.js',
          force: false,
        },
      },
    ],
  ],
  {
    webpack5: false,
  }
);
