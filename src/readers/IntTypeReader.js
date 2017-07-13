const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class IntTypeReader extends TypeReader {
  constructor() {
    super({ type: 'int' });
  }

  async read(command, message, arg, input) {
    const result = Number.parseFloat(input);

    if (Number.isInteger(result)) {
      return TypeReaderResult.fromSuccess(result);
    } else {
      return TypeReaderResult.fromError(command, 'You have provided an invalid ' + arg.name + '.');
    }
  }
}

module.exports = new IntTypeReader();
