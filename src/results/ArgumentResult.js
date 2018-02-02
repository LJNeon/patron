const Result = require('./Result.js');

/**
 * An argument result.
 * @prop {object} args The parsed arguments.
 * @extends {Result}
 */
class ArgumentResult extends Result {
  /**
   * @typedef {ArgumentResultOptions} ArgumentResultOptions The argument result options.
   * @prop {object} args The parsed arguments.
   */

  /**
   * @param {ArgumentResultOptions} options The argument result options.
   */
  constructor(options) {
    super(options);

    this.args = options.args;
  }
}

module.exports = ArgumentResult;
