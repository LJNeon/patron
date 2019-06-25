/*
 * patron.js - The cleanest command framework for discord.js and eris.
 * Copyright (c) 2019 patron.js contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
const Constants = require("../utility/Constants.js");

/**
 * A command argument.
 * @prop {*} defaultValue The argument's default value.
 * @prop {string} example The argument's example.
 * @prop {boolean} infinite Allow the argument to accept an infinite number of
 * values and return them in an array.
 * @prop {string} key The argument's property name on the args object.
 * @prop {string} name The argument's name.
 * @prop {boolean} optional Whether or not the argument is optional.
 * @prop {object[]} preconditionOptions The options to be passed to
 * preconditions when they're run.
 * @prop {ArgumentPrecondition[]} preconditions The preconditions to be ran on
 * the argument.
 * @prop {boolean} remainder Whether or not the argument is the remainder.
 * @prop {TypeReader} typeReader The argument's TypeReader.
 */
class Argument {
  /**
   * @typedef {object} ArgumentOptions The argument options.
   * @prop {*} [defaultValue] The argument's default value.
   * @prop {string} example The argument's example.
   * @prop {boolean} [infinite=false] Allow this argument accept an infinite
   * number of values and return them in an array.
   * @prop {string} key The argument's property name on the args object.
   * @prop {string} name The argument's name.
   * @prop {Array<*>} [preconditionOptions=[]] The options to be passed to
   * preconditions when they're run.
   * @prop {string[]} [preconditions=[]] The preconditions to be ran on the
   * argument.
   * @prop {boolean} [remainder=false] Whether or not the argument is the
   * remainder.
   * @prop {string} type The argument's type.
   */

  /**
   * @param {ArgumentOptions} options The argument options.
   */
  constructor(options) {
    this.optional = options.hasOwnProperty("defaultValue");
    this.defaultValue = options.defaultValue;
    this.example = options.example;
    this.infinite = options.infinite == null ? false : options.infinite;
    this.key = options.key;
    this.name = options.name;

    if (options.preconditionOptions == null)
      this.preconditionOptions = [];
    else
      this.preconditionOptions = options.preconditionOptions;

    if (options.preconditions == null)
      this.preconditions = [];
    else
      this.preconditions = options.preconditions;

    this.remainder = options.remainder == null ? false : options.remainder;
    this.type = options.type;
    this.constructor.validateArgument(this);
  }

  static validateArgument(argument) {
    if (typeof argument.example !== "string") {
      throw new TypeError(
        `${argument.constructor.name}: The example must be a string.`
      );
    } else if (typeof argument.infinite !== "boolean") {
      throw new TypeError(
        `${argument.constructor.name}: The infinite setting must be a boolean.`
      );
    } else if (typeof argument.key !== "string"
        || Constants.regexes.whiteSpace.test(argument.key)) {
      throw new TypeError(
        `${argument.constructor.name}: The key must be a string that does not \
        contain any whitespace characters.`
      );
    } else if (typeof argument.name !== "string") {
      throw new TypeError(
        `${argument.constructor.name}: The name must be a string.`
      );
    } else if (!Array.isArray(argument.preconditionOptions)) {
      throw new TypeError(
        `${argument.constructor.name}: The precondition options must be an \
        array.`
      );
    } else if (!Array.isArray(argument.preconditions)
        || argument.preconditions.some(pcnd => typeof pcnd !== "string")) {
      throw new TypeError(
        `${argument.constructor.name}: The preconditions must be an array.`
      );
    } else if (typeof argument.remainder !== "boolean") {
      throw new TypeError(
        `${argument.constructor.name}: The remainder setting must be a \
        boolean.`
      );
    } else if (typeof argument.type !== "string") {
      throw new TypeError(
        `${argument.constructor.name}: The type must be a string.`
      );
    }
  }
}

module.exports = Argument;
