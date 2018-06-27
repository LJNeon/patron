const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

/**
 * A command result.
 * @prop {*} data Information to be passed to the postconditions.
 * @extends {Result}
 */
class CommandResult extends Result {
  /**
   * @typedef {CommandResultOptions} CommandResultOptions The command result options.
   * @prop {*} data Information to be passed to the postconditions.
   */

  /**
   * @param {CommandResultOptions} options The command result options.
   */
  constructor(options) {
    super(options);

    this.data = options.data;
  }

  /**
   * Sets this result's command.
   * @param {Command} command The command this result came from.
   */
  setCommand(command) {
    this.command = command;
    this.commandName = command.names[0];
  }

  /**
   * Returns a failed command result.
   * @param {string} errorReason The reason for the command's failure.
   * @param {*} data Information to be passed to the postconditions.
   * @returns {CommandResult} The result in question.
   */
  static fromError(errorReason, data) {
    return new CommandResult({ success: false, commandError: CommandError.Command, data, errorReason });
  }
}

module.exports = CommandResult;
