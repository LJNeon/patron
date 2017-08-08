const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

/**
 * An exception result.
 * @prop {Error} error The error in question.
 * @extends {Result}
 */
class ExceptionResult extends Result {
  /**
   * @typedef {ResultOptions} ExceptionResultOptions
   * @prop {Error} error The error in question.
   */

  /**
   * @param {ExceptionResultOptions} options The exception result options.
   */
  constructor(options) {
    super(options);

    this.error = options.error;
  }

  /**
   * Returns an exception result.
   * @param {Command} command The command being executed.
   * @param {Error} error The error in question.
   * @returns {ExceptionResult} The result in question.
   */
  static fromError(command, error) {
    return new ExceptionResult({ success: false, command: command, commandError: CommandError.Exception, errorReason: error.message, error: error });
  }
}

module.exports = ExceptionResult;
