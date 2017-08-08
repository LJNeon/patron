const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const constants = require('../utility/Constants.js');

class CurrencyTypeReader extends TypeReader {
  constructor() {
    super({ type: 'currency' });
  }

  async read(command, message, argument, input) {
    let value = Number.parseFloat(input);

    if (Number.isNaN(value) === false) {
      if (constants.regexes.thousand.test(input) === true) {
        value *= 1000;
      } else if (constants.regexes.million.test(input) === true) {
        value *= 1000000;
      } else if (constants.regexes.billion.test(input) === true) {
        value *= 1000000000;
      }

      return TypeReaderResult.fromSuccess(value);
    }

    return TypeReaderResult.fromError(command, constants.errors.invalidArg(argument));
  }
}

module.exports = new CurrencyTypeReader();
