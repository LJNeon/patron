const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class StringTypeReader extends TypeReader {
  constructor() {
    super({ type: 'string' });
  }

  async read(command, message, arg, input) {
    return TypeReaderResult.fromSuccess(input);
  }
}

module.exports = new StringTypeReader();
