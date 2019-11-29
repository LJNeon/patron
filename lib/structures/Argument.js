/*
 * patron.js - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2019  patron.js contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import InvalidOptions from "../utils/InvalidOptions.js";

/**
 * An Argument for a Command.
 * @prop {?*} defaultValue The default value if none is provided.
 * @prop {?String} example An example of a valid input.
 * @prop {Boolean} infinite Allows the Argument to accept an unlimited amount of values, returning them in an array.
 * @prop {String} key The property name to be used for the argument values object supplied to the Command.
 * @prop {String} name The Argument name used in Command#getUsage(), defaults to Argument#key.
 * @prop {Boolean} optional Whether or not the Argument is optional.
 * @prop {Array<*>} preconditionOptions The options provided to the ArgumentPreconditions when ran.
 * @prop {Array<String>} preconditions The names of ArgumentPreconditions to run on the argument.
 * @prop {Boolean} remainder Allows the Argument to parse the full remainder of the command.
 * @prop {String} type The name of the TypeReader to use when parsing the Argument.
 */
export class Argument {
  /**
   * @arg {Object} options The Argument options.
   * @arg {*} [options.defaultValue] The default value if none is provided.
   * @arg {String} [options.example] An example of a valid input.
   * @arg {Boolean} [options.infinite=false] Allows the Argument to accept an unlimited amount of values,
   * returning them in an array.
   * @arg {String} [options.key] The property name to be used for the argument values object supplied
   * to the Command, defaults to Argument#type.
   * @arg {String} [options.name] The Argument name used in Command#getUsage(), defaults to Argument#type.
   * @arg {Array<*>} [options.preconditionOptions] The options provided to the ArgumentPreconditions when ran.
   * @arg {Array<String>} [options.preconditions] The names of ArgumentPreconditions to run on the argument.
   * @arg {Boolean} [options.remainder=false] Allows the Argument to parse the full remainder of the command.
   * @arg {String} options.type The name of the TypeReader to use when parsing the Argument.
   */
  constructor(options) {
    if(InvalidOptions(options))
      throw ReferenceError("The Argument constructor requires an options object.");

    this.defaultValue = options.defaultValue;
    this.optional = options.hasOwnProperty("defaultValue");
    this.example = options.example;
    this.infinite = options.infinite == null ? false : options.infinite;
    this.key = options.key == null ? options.type : options.key;
    this.name = options.name == null ? options.type : options.name;
    this.preconditionOptions = options.preconditionOptions == null ? [] : options.preconditionOptions;
    this.preconditions = options.preconditions == null ? [] : options.preconditions;
    this.remainder = options.remainder == null ? false : options.remainder;
    this.type = options.type;
    Argument.validate(this);
  }

  static validate(arg) {
    if(arg.example != null && typeof arg.example !== "string")
      throw TypeError("Argument#example must be a string if defined.");
    else if(typeof arg.infinite !== "boolean")
      throw TypeError("Argument#infinite must be a boolean.");
    else if(typeof arg.key !== "string")
      throw TypeError("Argument#key must be a string.");
    else if(typeof arg.name !== "string")
      throw TypeError("Argument#name must be a string.");
    else if(!Array.isArray(arg.preconditionOptions))
      throw TypeError("Argument#preconditionOptions must be an array.");
    else if(!Array.isArray(arg.preconditions) || arg.preconditions.some(pcnd => typeof pcnd !== "string"))
      throw TypeError("Argument#preconditions must be an array of strings.");
    else if(typeof arg.remainder !== "boolean")
      throw TypeError("Argument#remainder must be a boolean.");
    else if(typeof arg.type !== "string")
      throw TypeError("Argument#type must be a string.");
  }
}
