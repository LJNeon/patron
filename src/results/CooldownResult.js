const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

class CooldownResult extends Result {
  constructor(options) {
    super(options);

    this.cooldown = options.cooldown;
    this.remaining = options.remaining;
  }

  static fromError(command, cooldown, remaining) {
    return new CooldownResult({ isSuccess: false, command: command, commandError: CommandError.Cooldown, cooldown: cooldown, remaining: remaining });
  }
}

module.exports = CooldownResult;
