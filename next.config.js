const withWorkbox = require('next-with-workbox');

module.exports = withWorkbox({
  workbox: {
    swDest: '/sw.js',
    swSrc: '/worker.js',
    force: false,
  },
});
