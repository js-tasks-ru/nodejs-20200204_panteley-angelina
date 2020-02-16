const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.chunkLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.chunkLength += chunk.length;
    
    if(this.chunkLength > this.limit) {
      this.push(null);
      callback(new LimitExceededError());
    } else {
      this.push(chunk);
      callback();
    }
  }
}

module.exports = LimitSizeStream;
