const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (!filepath) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
      } else if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end();
      } else {
        const limitedSizeStream = new LimitSizeStream({limit: 1024 * 100});
        const writeStream = fs.createWriteStream(filepath);
        req.pipe(limitedSizeStream).pipe(writeStream);

        limitedSizeStream.on('error', (error) => {
          if (error.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
          } else {
            res.statusCode = 500;
          }
          fs.unlink(filepath, () => {});
          res.end();
        });
        req.on('close', () => {
          if (res.finished) return;
          fs.unlink(filepath, () => {});
          res.statusCode = 500;
          res.end();
        });
        writeStream.on('close', () => {
          res.statusCode = 201;
          res.end();
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
