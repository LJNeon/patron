const Result = require('./Result.js');
const CommandError = require('../enums/CommandError.js');

/**
 * A type reader result.
 * @prop {*} value The parsed value from the type reader.
 * @prop {?Array<object>} matches The type reader matches.
 * @extends {Result}
 */
class TypeReaderResult extends Result {
  /**
   * @typedef {ResultOptions} TypeReaderResultOptions The type reader result options.
   * @prop {*} value The parsed value from the type reader.
   * @prop {?Array<object>} matches The type reader matches.
   */

  /**
   * @param {TypeReaderResultOptions} options The type reader result options.
   */
  constructor(options) {
    super(options);

    this.value = options.value;
    this.matches = options.matches;
  }

  /**
   * Returns a successful type reader result.
   * @param {*} value The parsed value from the type reader.
   * @returns {TypeReaderResult} The result in question.
   */
  static fromSuccess(value) {
    return new TypeReaderResult({ success: true, value: value });
  }

  /**
   * Returns a failed type reader result.
   * @param {Command} command The command being executed.
   * @param {string} reason The reason for the type reader failure.
   * @param {object[]} [matches=undefined] The type reader matches.
   * @returns {TypeReaderResult} The result in question.
   */
  static fromError(command, reason, matches) {
    return new TypeReaderResult({ success: false, command: command, commandError: CommandError.TypeReader, errorReason: reason, matches: matches });
  }
}

module.exports = TypeReaderResult;
