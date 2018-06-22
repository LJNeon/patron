/**
 * A command postcondition.
 * @prop {string} name The name of the postcondition.
 * @prop {string} description The description of the postcondition.
 */
class Postcondition {
  /**
   * @typedef {object} PostconditionOptions The postconditions options.
   * @prop {string} name The name of the postcondition.
   * @prop {string} [description=''] The description of the postcondition.
   */

  /**
   * @param {PostconditionOptions} options The postconditions options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description === undefined ? '' : options.description;

    this.constructor.validatePostcondition(this, this.constructor.name);
  }

  /**
   * Executes the postcondition.
   * @param {Message} message The received message.
   * @param {?CommandResult} result The result of the command execution, if any.
   * @param {...*} custom The custom parameters passed into the handler.
   * @abstract
   */
  async run(message, result, custom) {
    throw new Error(this.constructor.name + ' has no run method.');
  }

  /**
   * Validates a postcondition.
   * @param {Postcondition} postcondition The postcondition to validate.
   * @param {string} name The name of the constructor of the postcondition.
   * @private
   */
  static validatePostcondition(postcondition, name) {
    if (typeof postcondition.name !== 'string') {
      throw new TypeError(name + ': The name must be a string.');
    } else if (typeof postcondition.description !== 'string') {
      throw new TypeError(name + ': All precondition descriptions must be a string.');
    }
  }
}

module.exports = Postcondition;
