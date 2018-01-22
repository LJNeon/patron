const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');

class StringTypeReader extends TypeReader {
  constructor() {
    super({ type: 'string' });

    this.category = TypeReaderCategory.Global;
  }

  async read(command, message, argument, args, input) {
    return TypeReaderResult.fromSuccess(input);
  }
}

module.exports = new StringTypeReader();
