const Result = require('./Result.js');

/**
 * A cooldown result.
 * @prop {number} remaining The time remaining on the command cooldown.
 * @extends {Result}
 */
class CooldownResult extends Result {
  /**
   * @typedef {CooldownResultOptions} CooldownResultOptions The cooldown result options.
   * @prop {number} remaining The time remaining on the command cooldown.
   */

  /**
   * @param {CooldownResultOptions} options The cooldown result options.
   */
  constructor(options) {
    super(options);

    this.remaining = options.remaining;
  }
}

module.exports = CooldownResult;
