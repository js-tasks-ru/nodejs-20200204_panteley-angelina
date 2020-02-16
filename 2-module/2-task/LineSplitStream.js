const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const lines = ((this.soFar != null ? this.soFar:"") + chunk.toString()).split(os.EOL);

    this.soFar = lines.pop();

    for(let line of lines) this.push(line);

    callback();
  }

  _flush(callback) {
    this.push(this.soFar != null ? this.soFar:"");

    callback();
  }
}

module.exports = LineSplitStream;
