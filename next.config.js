const withWorkbox = require('next-with-workbox');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

module.exports = withWorkbox({
  workbox: {
    swDest: '/sw.js',
    swSrc: '/worker.js',
    force: false,
  },
});
