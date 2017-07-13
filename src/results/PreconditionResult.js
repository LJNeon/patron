import Result from './Result.js';
import CommandError from '../enums/CommandError.js';

class PreconditionResult extends Result {
  static fromSuccess() {
    return new PreconditionResult({ success: true });
  }

  static fromError(command, reason) {
    return new PreconditionResult({ success: false, command: command, commandError: CommandError.Precondition, errorReason: reason });
  }
}

export default PreconditionResult;
