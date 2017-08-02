const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

/**
 * A cooldown result.
 * @prop {number} cooldown The full cooldown of the command.
 * @prop {number} remaining The time remaining on the command cooldown.
 * @extends Result
 */
class CooldownResult extends Result {
  /**
   * @typedef {ResultOptions} CooldownResultOptions The cooldown result options.
   * @prop {number} cooldown The full cooldown of the command.
   * @prop {number} remaining The time remaining on the command cooldown. 
   */

  /**
   * @param {CooldownResultOptions} options The cooldown result options.
   */
  constructor(options) {
    super(options);

    this.cooldown = options.cooldown;
    this.remaining = options.remaining;
  }

  /**
   * Returns a failed cooldown result.
   * @param {Command} command The command being executed.
   * @param {number} cooldown The full cooldown of the command.
   * @param {number} remaining The time remaining on the command cooldown.
   * @returns {CooldownResult} The result in question.
   */
  static fromError(command, cooldown, remaining) {
    return new CooldownResult({ success: false, command: command, commandError: CommandError.Cooldown, errorReason: 'This command is on a cooldown.', cooldown: cooldown, remaining: remaining });
  }
}

module.exports = CooldownResult;
