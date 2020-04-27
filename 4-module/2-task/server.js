const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      console.error(filepath);

      if (fs.existsSync(filepath)) {
        console.error('Файл уже существует');
        res.statusCode = 409;
      } else if (pathname.split('/').length > 1) {
        res.statusCode = 400;
      } else {
        const stream = new LimitSizeStream({limit: 1024 * 100});
        const writeStream = fs.createWriteStream(filepath);
        req.pipe(stream).pipe(writeStream);

        stream.on('error', (error) => {
          console.error(error.message);
          if (error.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
          } else {
            res.statusCode = 500;
          }
        });

        //
        // req.on('close', () => {
        //   fs.unlink(filepath);
        //   res.statusCode = 500;
        // });
      }
      res.end();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
