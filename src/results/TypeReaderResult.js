const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

class TypeReaderResult extends Result {
  static fromSuccess(value) {
    return new TypeReaderResult({ success: true, value: value });
  }

  static fromError(command, reason) {
    return new TypeReaderResult({ success: false, command: command, commandError: CommandError.TypeReader, errorReason: reason });
  }
}

module.exports = TypeReaderResult;
