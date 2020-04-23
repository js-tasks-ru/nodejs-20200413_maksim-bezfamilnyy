const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {

  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.totalLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.totalLength += Buffer.byteLength(chunk);
    // console.error(Buffer.byteLength(this.data));
    if (this.totalLength > this.limit) {
      return callback(new LimitExceededError());
    }
    this.push(chunk);
    return callback();
  }
}

module.exports = LimitSizeStream;
