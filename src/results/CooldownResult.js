const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

/**
 * A cooldown result.
 * @prop {number} remaining The time remaining on the command cooldown.
 * @extends {Result}
 */
class CooldownResult extends Result {
  /**
   * @typedef {ResultOptions} CooldownResultOptions The cooldown result options.
   * @prop {number} remaining The time remaining on the command cooldown.
   */

  /**
   * @param {CooldownResultOptions} options The cooldown result options.
   */
  constructor(options) {
    super(options);

    this.remaining = options.remaining;
  }

  /**
   * Returns a failed cooldown result.
   * @param {Command} command The command being executed.
   * @param {number} remaining The time remaining on the command cooldown.
   * @returns {CooldownResult} The result in question.
   */
  static fromError(command, remaining) {
    return new CooldownResult({ success: false, command: command, commandError: CommandError.Cooldown, errorReason: 'This command is on a cooldown.', remaining: remaining });
  }
}

module.exports = CooldownResult;
