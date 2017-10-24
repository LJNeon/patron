/**
 * A result.
 * @prop {boolean} success Whether the command execution was successful.
 * @prop {?Command} command The executed command.
 * @prop {?CommandError} commandError The command error.
 * @prop {?string} errorReason The reason for the failed execution.
 */
class Result {
  /**
   * @typedef {object} ResultOptions The result options.
   * @prop {boolean} success Whether the command execution was successful.
   * @prop {?Command} command The executed command.
   * @prop {?CommandError} commandError The command error.
   * @prop {?string} errorReason The reason for the failed execution.
   */

  /**
   * @param {ResultOptions} options The result options.
   */
  constructor(options) {
    this.success = options.success;
    this.command = options.command;
    this.commandError = options.commandError;
    this.errorReason = options.errorReason;
  }
}

module.exports = Result;
