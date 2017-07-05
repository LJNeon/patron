const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

class TypeReaderResult extends Result {
  constructor(options) {
    super(options);

    this.value = options.value;
  }

  static fromSuccess(value) {
    return new TypeReaderResult({ isSuccess: true, value: value });
  }

  static fromError(command, reason) {
    return new TypeReaderResult({ isSuccess: false, command: command, commandError: CommandError.TypeReader, errorReason: reason });
  }
}

module.exports = TypeReaderResult;