const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { CLIENT_BASE_URL, PORT } = require('./conf');

const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost.key'),
  cert: fs.readFileSync('./certificates/localhost.crt'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT || 3000, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on ${CLIENT_BASE_URL}`);
  });
});
