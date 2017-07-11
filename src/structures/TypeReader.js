class TypeReader {
  constructor(options) {
    this.type = options.type;

    this.constructor.validateTypeReader(this, this.constructor.name);
  }

  async read(command, msg, arg, input) {
    throw new Error(this.constructor.name + ' has no read method.');
  }

  static validateTypeReader(typeReader, name) {
    if (typeof typeReader.type !== 'string' || typeReader.type !== typeReader.type.toLowerCase()) {
      throw new TypeError(name + ': The type must be a lowercase string.');
    }
  }
}

module.exports = TypeReader;
