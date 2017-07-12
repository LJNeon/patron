const ArgumentPrecondition = require('./ArgumentPrecondition.js');
const regexes = require('../constants/regexes.js');

class Argument {
  constructor(options) {
    this.name = options.name;
    this.key = options.key;
    this.type = options.type;
    this.example = options.example;
    this.default = options.default;
    this.preconditions = options.preconditions !== undefined ? options.preconditions : [];
    this.isOptional = options.default !== undefined;
    this.isRemainder = options.isRemainder !== undefined ? options.isRemainder : false;

    this.constructor.validateArgument(this, this.constructor.name);
  }

  static validateArgument(argument, name) {
    if (typeof argument.name !== 'string') {
      throw new TypeError(name + ': The name must be a string.');
    } else if (typeof argument.key !== 'string' || regexes.noWhiteSpace.test(argument.key)) {
      throw new TypeError(name + ': The key must be a string that does not contain any whitespace characters.');
    } else if (typeof argument.type !== 'string' || argument.type !== argument.type.toLowerCase()) {
      throw new TypeError(name + ': The type must be a lowercase string.');
    } else if (typeof argument.example !== 'string') {
      throw new TypeError(name + ': The example must be a string.');
    } else if (!Array.isArray(argument.preconditions)) {
      throw new TypeError(name + ': The preconditions must be an array.');
    }

    for (const precondition of argument.preconditions) {
      if (typeof precondition !== 'object') {
        throw new TypeError(name + ': All argument precondition exports must be an instance of the argument precondition.');
      } else if (!(precondition instanceof ArgumentPrecondition)) {
        throw new TypeError(name + ': All argument preconditions must inherit the ArgumentPrecondition class.');
      }
    }
  }
}

module.exports = Argument;
