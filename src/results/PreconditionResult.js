const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

class PreconditionResult extends Result {
  constructor(options) {
    super(options);
  }

  static fromSuccess() {
    return new PreconditionResult({ isSuccess: true });
  }

  static fromError(command, reason) {
    return new PreconditionResult({ isSuccess: false, command: command, commandError: CommandError.Precondition, errorReason: reason });
  }
}

module.exports = PreconditionResult;