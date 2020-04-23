const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.prevChankPart = '';
  }

  _transform(chunk, encoding, callback) {
    const splitted = chunk.toString().split(os.EOL);
    const finishedByRn = splitted[splitted.length - 1] === '';
    let part;
    for (let i = 0; i < splitted.length; i++) {
      part = splitted[i];
      if (i === 0) {
        part = this.prevChankPart + part;
        this.prevChankPart = '';
      }

      if (!finishedByRn && (i === (splitted.length - 1))) {
        this.prevChankPart = part;
      } else {
        this.push(part);
      }
    }
    return callback();
  }

  _flush(callback) {
    if (this.prevChankPart !== '') {
      this.push(this.prevChankPart);
    }
    return callback();
  }
}

module.exports = LineSplitStream;
