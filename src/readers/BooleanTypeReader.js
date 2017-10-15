const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const Constants = require('../utility/Constants.js');

class BooleanTypeReader extends TypeReader {
  constructor() {
    super({ type: 'bool' });
  }

  async read(command, message, argument, value) {
    const lowerValue = value.toLowerCase();

    if (Constants.trueValues.includes(lowerValue)) {
      return TypeReaderResult.fromSuccess(true);
    } else if (Constants.falseValues.includes(lowerValue)) {
      return TypeReaderResult.fromSuccess(false);
    }

    return TypeReaderResult.fromError(value);
  }
}

module.exports = new BooleanTypeReader();
