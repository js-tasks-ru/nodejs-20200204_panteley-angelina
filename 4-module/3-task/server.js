const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if(pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('400 Not Supported');
        return;
      }

      fs.access(filepath, fs.F_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('404 Not Found');
          return;
        }

        fs.unlink(filepath, (err) => {
          if(err) {
            res.statusCode = 500;
            res.end('Internal server error');
            return;
          }

          res.statusCode = 200;
          res.end();
        });
      });
  
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
