const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

/**
 * A precondition result.
 * @extends Result
 */
class PreconditionResult extends Result {
  /**
   * @param {TypeReaderResultOptions} options The type reader result options.
   */
  constructor(options) {
    super(options);

    this.value = options.value;
  }

  /**
   * Returns a successful precondition result.
   * @returns {PreconditionResult} The result in question.
   */
  static fromSuccess() {
    return new PreconditionResult({ success: true });
  }

  /**
   * Returns a failed precondition result.
   * @param {Command} command The command being executed.
   * @param {string} reason The reason for the precondition failure.
   * @returns {PreconditionResult} The result in question.
   */
  static fromError(command, reason) {
    return new PreconditionResult({ success: false, command: command, commandError: CommandError.Precondition, errorReason: reason });
  }
}

module.exports = PreconditionResult;
