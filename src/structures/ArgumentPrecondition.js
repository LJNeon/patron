/**
 * An argument precondition.
 * @prop {string} name The name of the precondition.
 * @prop {string} description The description of the precondition.
 */
class ArgumentPrecondition {
  /**
   * @typedef {object} ArgumentPreconditionOptions The preconditions options.
   * @prop {string} name The name of the precondition.
   * @prop {string} [description=''] The description of the precondition.
   */

  /**
   * @param {ArgumentPreconditionOptions} options The preconditions options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description === undefined ? '' : options.description;

    this.constructor.validateArgumentPrecondition(this, this.constructor.name);
  }

  /**
   * Executes the argument precondition.
   * @param {Command} command The command being run.
   * @param {Message} message The received message.
   * @param {Argument} argument The argument in question.
   * @param {object} args The currently resolved arguments.
   * @param {*} value The value of the argument.
   * @param {*} options The options of the argument precondition.
   * @param {...*} custom The custom parameters passed into the handler.
   * @abstract
   * @returns {Promise<PreconditionResult>} The result of the argument precondition.
   */
  async run(command, message, argument, args, value, options, custom) {
    throw new Error(this.constructor.name + ' has no run method.');
  }

  /**
   * Validates an argument precondition.
   * @param {ArgumentPrecondition} argumentPrecondition The argument precondition to validate.
   * @param {string} name The name of the constructor of the argument precondition.
   * @private
   */
  static validateArgumentPrecondition(argumentPrecondition, name) {
    if (typeof argumentPrecondition.name !== 'string') {
      throw new TypeError(name + ': The name must be a string.');
    } else if (typeof argumentPrecondition.description !== 'string') {
      throw new TypeError(name + ': All argument precondition descriptions must be a string.');
    }
  }
}

module.exports = ArgumentPrecondition;
