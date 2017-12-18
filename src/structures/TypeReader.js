const TypeReaderCategories = require('../enums/TypeReaderCategories.js');

/**
 * A type reader.
 * @prop {string} type The type of the type reader.
 * @prop {string} category Which category the type reader belongs to.
 * @prop {string} description The description of the type reader.
 */
class TypeReader {
  /**
   * @typedef {object} TypeReaderOptions The type reader options.
   * @prop {string} type The type of the type reader.
   * @prop {string} [description=''] The description of the type reader.
   */

  /**
    * @param {TypeReaderOptions} options The type reader options.
    */
  constructor(options) {
    this.category = TypeReaderCategories.User;
    this.type = options.type;
    this.description = options.description !== undefined ? options.description : '';

    this.constructor.validateTypeReader(this, this.constructor.name);
  }

  /**
   * Parses the value of an argument.
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @param {Argument} argument The argument in question.
   * @param {object} args The currently resolved arguments.
   * @param {string} input The user input.
   * @param {*} custom The custom parameters passed into the handler.
   * @abstract
   * @returns {Promise<TypeReaderResult>} The result of the type reader.
   */
  async read(command, message, argument, args, input, custom) {
    throw new Error(this.constructor.name + ' has no read method.');
  }

  /**
   * Validates the argument.
   * @param {TypeReader} typeReader The type reader to validate.
   * @param {string} name The name of the constructor of the type reader.
   * @private
   */
  static validateTypeReader(typeReader, name) {
    if (typeof typeReader.type !== 'string' || typeReader.type !== typeReader.type.toLowerCase()) {
      throw new TypeError(name + ': The type must be a lowercase string.');
    } else if (typeof typeReader.description !== 'string') {
      throw new TypeError(name + ': All type reader descriptions must be a string.');
    }
  }
}

module.exports = TypeReader;
