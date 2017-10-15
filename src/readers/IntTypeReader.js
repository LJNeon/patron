const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const Constants = require('../utility/Constants.js');

class IntTypeReader extends TypeReader {
  constructor() {
    super({ type: 'int' });
  }

  async read(command, message, argument, args, input) {
    const result = Number.parseFloat(input);

    if (Number.isInteger(result) === true) {
      return TypeReaderResult.fromSuccess(result);
    }

    return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
  }
}

module.exports = new IntTypeReader();
