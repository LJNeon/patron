const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class FloatTypeReader extends TypeReader {
  constructor() {
    super({ type: 'float' });
  }

  async read(command, context, arg, input) {
    const result = Number.parseFloat(input);

    if (result !== Number.NaN) {
      return TypeReaderResult.fromSuccess(result);
    } else {
      return TypeReaderResult.fromError(command, 'You have provided an invalid ' + arg.name + '.');
    }
  }
}

module.exports = new FloatTypeReader();
