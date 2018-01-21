const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

/**
 * An invalid context result.
 * @extends {Result}
 */
class InvalidContextResult extends Result {
  /**
   * @param {ResultOptions} options The result options.
   */
  constructor(options) {
    super(options);
  }

  /**
   * Returns an invalid context result.
   * @param {Command} command The command being executed.
   * @param {Symbol} context The context that was invalid.
   * @returns {InvalidContextResult} The result in question.
   */
  static fromError(command, context) {
    return new InvalidContextResult({ success: false, command: command, commandError: CommandError.Precondition, context: context, errorReason: 'This command may not be used in that context.' });
  }
}

module.exports = InvalidContextResult;
