const ArgumentPrecondition = require('./ArgumentPrecondition.js');

class Argument {
  constructor(options) {
    this.name = options.name;
    this.key = options.key;
    this.type = options.type;
    this.example = options.example;
    this.default = options.default;
    this.preconditions = options.preconditions || [];
    this.isOptional = typeof options.default !== 'undefined';
    this.isRemainder = options.isRemainder || false;

    validateArgument(this, this.constructor.name);
  }
}

module.exports = Argument;

const validateArgument = function(argument, name) {
  if (typeof argument.name !== 'string') {
    throw new TypeError(name + ': The name must be a string.');
  } else if (typeof argument.key !== 'string' || argument.key !== argument.key.toLowerCase()) {
    throw new TypeError(name + ': The key must be a lowercase string.');
  } else if (argument.key.includes(' ')) {
    throw new TypeError(name + ': The key may not contain spaces.');
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
};
