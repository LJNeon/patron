const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

class ExceptionResult extends Result {
  static fromError(command, error) {
    return new ExceptionResult({ success: false, command: command, commandError: CommandError.Exception, errorReason: error.message, error: error });
  }
}

module.exports = ExceptionResult;
