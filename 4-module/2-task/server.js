const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const { finished } = require('stream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
  }

  switch (req.method) {
    case 'POST':
      const stream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limit = new LimitSizeStream({limit: 1000000});

      req.pipe(limit).pipe(stream);

      stream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File already exists');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }
      });

      limit.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          fs.unlinkSync(filepath);
          res.statusCode = 413;
          res.end('Limit exceeded');
          return;
        }
      });

      res.on('close', () => {
        if (res.finished) return;
        fs.unlinkSync(filepath);
        stream.destroy();
      });

      finished(stream, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal server error');
        } else {
          res.statusCode = 201;
          res.end();
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
