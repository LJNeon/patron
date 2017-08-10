/**
 * A type reader.
 * @prop {string} type The type of the type reader.
 */
class TypeReader {
  /**
   * @typedef {object} TypeReaderOptions The type reader options.
   * @prop {string} type The type of the type reader.
   */

  /**
    * @param {TypeReaderOptions} options The type reader options.
    */
  constructor(options) {
    this.type = options.type;

    this.constructor.validateTypeReader(this, this.constructor.name);
  }

  /**
   * Parses the value of an argument.
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @param {Argument} argument The argument in question.
   * @param {string} input The user input.
   * @abstract
   * @returns {Promise<TypeReaderResult>} The result of the type reader.
   */
  async read(command, message, argument, input) {
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
    }
  }
}

module.exports = TypeReader;
