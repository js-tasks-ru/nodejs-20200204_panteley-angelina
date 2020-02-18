const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
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
      
        const mimeType = mimeTypes[pathname.split(".")[1]] || 'text/plain';
        res.writeHead(200, { 'Content-Type': mimeType });

        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
      });
      
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
