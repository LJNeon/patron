import Result from './Result.js';
import CommandError from '../enums/CommandError.js';

class CooldownResult extends Result {
  static fromError(command, cooldown, remaining) {
    return new CooldownResult({ success: false, command: command, commandError: CommandError.Cooldown, errorReason: 'This command is on a cooldown.', cooldown: cooldown, remaining: remaining });
  }
}

export default CooldownResult;
