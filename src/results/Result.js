/**
 * A result.
 * @prop {boolean} success Whether the command execution was successful.
 * @prop {Command} command The executed command.
 * @prop {CommandError?} commandError The command error.
 * @prop {string?} errorReason The reason for the failed execution.
 */
class Result {
  /**
   * @typedef {object} ResultOptions The result options.
   * @prop {boolean} success Whether the command execution was successful.
   * @prop {Command?} command The executed command.
   * @prop {CommandError} commandError The command error.
   * @prop {string?} errorReason The reason for the failed execution.
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

  /**
   * @param {Command} command The command being executed.
   * @returns {Result} The result in question.
   */
  static fromSuccess(command) {
    return new Result({ success: true, command: command });
  }

  /**
   * @param {Command} command The command being executed.
   * @param {CommandError} commandError The command error in question.
   * @param {string} errorReason The reason for the execution failure.
   * @returns {Result} The result in question.
   */
  static fromError(command, commandError, errorReason) {
    return new Result({ success: false, command: command, commandError: commandError, errorReason: errorReason });
  }
}

module.exports = Result;
