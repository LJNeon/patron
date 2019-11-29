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
 * A reader that parses the input into a type.
 * @prop {Boolean} default Whether this type reader is built into patron.js or user-made.
 * @prop {String} type The name of the type being parsed.
 */
export class TypeReader {
  /**
   * @arg {Object} options The TypeReader options.
   * @arg {String} options.type The name of the type being parsed.
   */
  constructor(options) {
    if(InvalidOptions(options))
      throw ReferenceError("The TypeReader constructor requires an options object.");

    this.default = false;
    this.type = options.type;
    TypeReader.validate(this);
  }

  /**
   * Parses the provided input into a type.
   * @abstract
   * @arg {String} input The input provided by a user.
   * @arg {Command} command The command being run.
   * @arg {Message} message The received message.
   * @arg {Argument} argument The argument being parsed.
   * @arg {Object} arguments The previously parsed arguments.
   * @returns {(TypeReaderResult|Promise<TypeReaderResult>)} The typed value or a failure result.
   */
  read() {
    throw ReferenceError("TypeReader#read must be a function.");
  }

  static validate(reader) {
    if(typeof reader.type !== "string")
      throw TypeError("TypeReader#type must be a string.");
  }
}
