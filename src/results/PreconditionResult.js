const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

class PreconditionResult extends Result {
  static fromSuccess() {
    return new PreconditionResult({ success: true });
  }

  static fromError(command, reason) {
    return new PreconditionResult({ success: false, command: command, commandError: CommandError.Precondition, errorReason: reason });
  }
}

module.exports = PreconditionResult;
