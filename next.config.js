const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withWorkbox = require('next-with-workbox');

module.exports = withBundleAnalyzer(
  withWorkbox({
    workbox: {
      swDest: '/sw.js',
      swSrc: '/worker.js',
      force: false,
    },
  })
);
