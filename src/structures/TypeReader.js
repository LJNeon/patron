class TypeReader {
  constructor(options) {
    this.type = options.type;

    validateTypeReader(this, this.constructor.name);
  }

  async read(command, context, arg, input) {
    throw new Error(this.constructor.name + ' has no read method.');
  }
}

module.exports = TypeReader;

const validateTypeReader = function(typeReader, name) {
  if (typeof typeReader.type !== 'string' || typeReader.type !== typeReader.type.toLowerCase()) {
    throw new TypeError(name + ': The type must be a lowercase string.');
  }
};
