import Result from './Result.js';
import CommandError from '../enums/CommandError.js';

class TypeReaderResult extends Result {
  static fromSuccess(value) {
    return new TypeReaderResult({ success: true, value: value });
  }

  static fromError(command, reason) {
    return new TypeReaderResult({ success: false, command: command, commandError: CommandError.TypeReader, errorReason: reason });
  }
}

export default TypeReaderResult;
