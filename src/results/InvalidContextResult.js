const Result = require('./Result.js');

/**
 * An invalid context result.
 * @extends {Result}
 */
class InvalidContextResult extends Result {
  /**
   * @param {ResultOptions} options The result options.
   */
  constructor(options) {
    super(options);
  }
}

module.exports = InvalidContextResult;
