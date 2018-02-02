const Result = require('./Result.js');

/**
 * An exception result.
 * @prop {Error} error The error in question.
 * @extends {Result}
 */
class ExceptionResult extends Result {
  /**
   * @typedef {ExceptionResultOptions} ExceptionResultOptions
   * @prop {Error} error The error in question.
   */

  /**
   * @param {ExceptionResultOptions} options The exception result options.
   */
  constructor(options) {
    super(options);

    this.error = options.error;
  }
}

module.exports = ExceptionResult;
