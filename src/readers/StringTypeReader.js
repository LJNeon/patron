import TypeReader from '../structures/TypeReader.js';
import TypeReaderResult from '../results/TypeReaderResult.js';

class StringTypeReader extends TypeReader {
  constructor() {
    super({ type: 'string' });
  }

  async read(command, message, arg, input) {
    return TypeReaderResult.fromSuccess(input);
  }
}

export default new StringTypeReader();
