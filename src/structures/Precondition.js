/**
 * A command precondition.
 * @prop {string} name The name of the precondition.
 * @prop {string} description The description of the precondition.
 */
class Precondition {
  /**
   * @typedef {object} PreconditionOptions The preconditions options.
   * @prop {string} name The name of the precondition.
   * @prop {string} [description=''] The description of the precondition.
   */

  /**
   * @param {PreconditionOptions} options The preconditions options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description == null ? '' : options.description;

    this.constructor.validatePrecondition(this, this.constructor.name);
  }

  /**
   * Executes the precondition.
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @param {*} options The options of the precondition.
   * @param {...*} custom The custom parameters passed into the handler.
   * @abstract
   * @returns {Promise<PreconditionResult>} The result of the precondition.
   */
  async run(command, message, options, custom) {
    throw new Error(this.constructor.name + ' has no run method.');
  }

  /**
   * Validates a precondition.
   * @param {Precondition} precondition The precondition to validate.
   * @param {string} name The name of the constructor of the precondition.
   * @private
   */
  static validatePrecondition(precondition, name) {
    if (typeof precondition.name !== 'string') {
      throw new TypeError(name + ': The name must be a string.');
    } else if (typeof precondition.description !== 'string') {
      throw new TypeError(name + ': All precondition descriptions must be a string.');
    }
  }
}

module.exports = Precondition;
