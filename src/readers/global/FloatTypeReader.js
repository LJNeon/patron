const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');

class FloatTypeReader extends TypeReader {
  constructor() {
    super({ type: 'float' });

    this.category = TypeReaderCategory.Global;
  }

  async read(command, message, argument, args, input) {
    const result = Number.parseFloat(input);

    if (Number.isNaN(result) === false) {
      return TypeReaderResult.fromSuccess(result);
    }

    return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
  }
}

module.exports = new FloatTypeReader();
