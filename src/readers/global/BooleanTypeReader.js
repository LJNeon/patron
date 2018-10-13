const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');

class BooleanTypeReader extends TypeReader {
  constructor() {
    super({ type: 'bool' });

    this.category = TypeReaderCategory.Global;
  }

  async read(command, message, argument, args, value) {
    const lowerValue = value.toLowerCase();

    if (Constants.trueValues.includes(lowerValue)) {
      return TypeReaderResult.fromSuccess(true);
    } else if (Constants.falseValues.includes(lowerValue)) {
      return TypeReaderResult.fromSuccess(false);
    }

    return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
  }
}

module.exports = new BooleanTypeReader();
