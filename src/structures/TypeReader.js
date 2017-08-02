/**
 * A type reader.
 */
class TypeReader {
  constructor(options) {
    this.type = options.type;

    this.constructor.validateTypeReader(this, this.constructor.name);
  }

  /**
   * 
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @param {Argument} argument The argument in question.
   * @param {string} input The user input.
   * @returns {Promise<TypeReaderResult>} The result of the type reader.
   */
  async read(command, message, argument, input) {
    throw new Error(this.constructor.name + ' has no read method.');
  }

  /**
   * 
   * @param {TypeReader} typeReader The type reader to validate.
   * @param {string} name The name of the type reader.
   * @private
   */
  static validateTypeReader(typeReader, name) {
    if (typeof typeReader.type !== 'string' || typeReader.type !== typeReader.type.toLowerCase()) {
      throw new TypeError(name + ': The type must be a lowercase string.');
    }
  }
}

module.exports = TypeReader;
