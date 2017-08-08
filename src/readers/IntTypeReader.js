const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const constants = require('../utility/Constants.js');

class IntTypeReader extends TypeReader {
  constructor() {
    super({ type: 'int' });
  }

  async read(command, message, argument, input) {
    const result = Number.parseFloat(input);

    if (Number.isInteger(result) === true) {
      return TypeReaderResult.fromSuccess(result);
    }

    return TypeReaderResult.fromError(command, constants.errors.invalidArg(argument));
  }
}

module.exports = new IntTypeReader();
