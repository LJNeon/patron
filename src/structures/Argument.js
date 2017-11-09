const ArgumentPrecondition = require('./ArgumentPrecondition.js');
const Constants = require('../utility/Constants.js');

/**
 * A command argument.
 * @prop {string} name The name of the argument.
 * @prop {string} key The key of the argument, acting as the name of the property on the args object.
 * @prop {string} type The type of the argument.
 * @prop {TypeReader} typeReader The type reader of the argument.
 * @prop {string} example An example of the argument.
 * @prop {*} defaultValue The default value of the argument.
 * @prop {boolean} infinite Allow this argument accept an infinite number of values and return them in an array.
 * @prop {ArgumentPrecondition[]} preconditions The preconditions to be ran on the argument.
 * @prop {boolean} optional Whether the argument is optional.
 * @prop {boolean} remainder Whether the argument is the remainder.
 */
class Argument {
  /**
   * @typedef {object} ArgumentOptions The argument options.
   * @prop {string} name The name of the argument.
   * @prop {string} key The key of the argument, acting as the name of the property on the args object.
   * @prop {string} type The type of the argument.
   * @prop {string} example An example of the argument.
   * @prop {*} [defaultValue=undefined] The default value of the argument.
   * @prop {boolean} [infinite=false] Allow this argument accept an infinite number of values and return them in an array.
   * @prop {Array<string|object>} [preconditions=[]] The preconditions to be ran on the argument.
   * @prop {boolean} [remainder=false] Whether the argument is the remainder.
   */

  /**
   * @param {ArgumentOptions} options The argument options.
   */
  constructor(options) {
    this.name = options.name;
    this.key = options.key;
    this.type = options.type;
    this.example = options.example;
    this.defaultValue = options.defaultValue;
    this.infinite = options.infinite !== undefined ? options.infinite : false;
    this.preconditions = options.preconditions !== undefined ? options.preconditions : [];
    this.optional = options.defaultValue !== undefined;
    this.remainder = options.remainder !== undefined ? options.remainder : false;
    this.preconditionOptions = [];

    this.constructor.validateArgument(this, this.constructor.name);
  }

  /**
   * Validates an argument.
   * @param {Argument} argument The argument to validate.
   * @param {string} name The name of the constructor of the argument.
   * @private
   */
  static validateArgument(argument, name) {
    if (typeof argument.name !== 'string') {
      throw new TypeError(name + ': The name must be a string.');
    } else if (typeof argument.key !== 'string' || Constants.regexes.whiteSpace.test(argument.key)) {
      throw new TypeError(name + ': The key must be a string that does not contain any whitespace characters.');
    } else if (typeof argument.type !== 'string' || argument.type !== argument.type.toLowerCase()) {
      throw new TypeError(name + ': The type must be a lowercase string.');
    } else if (typeof argument.example !== 'string') {
      throw new TypeError(name + ': The example must be a string.');
    } else if (typeof argument.infinite !== 'boolean') {
      throw new TypeError(name + ': The infinite setting must be a boolean.');
    } else if (typeof argument.remainder !== 'boolean') {
      throw new TypeError(name + ': The remainder setting must be a boolean.');
    } else if (argument.infinite === true && argument.remainder === true) {
      throw new Error(name + ': An argument may not be infinite and remainder.');
    } else if (Array.isArray(argument.preconditions) === false) {
      throw new TypeError(name + ': The preconditions must be an array.');
    }

    for (let i = 0; i < argument.preconditions.length; i++) {
      if (typeof argument.preconditions[i] !== 'object') {
        throw new TypeError(name + ': All argument precondition exports must be an instance of the argument precondition.');
      } else if ((argument.preconditions[i] instanceof ArgumentPrecondition) === false) {
        throw new TypeError(name + ': All argument preconditions must inherit the ArgumentPrecondition class.');
      }
    }
  }
}

module.exports = Argument;
