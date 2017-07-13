import TypeReader from '../structures/TypeReader.js';
import TypeReaderResult from '../results/TypeReaderResult.js';

class IntTypeReader extends TypeReader {
  constructor() {
    super({ type: 'int' });
  }

  async read(command, message, arg, input) {
    const result = Number.parseFloat(input);

    if (Number.isInteger(result)) {
      return TypeReaderResult.fromSuccess(result);
    }

    return TypeReaderResult.fromError(command, 'You have provided an invalid ' + arg.name + '.');
  }
}

export default new IntTypeReader();
