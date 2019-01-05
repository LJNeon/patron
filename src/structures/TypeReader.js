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
const TypeReaderCategory = require("../enums/TypeReaderCategory.js");

/**
 * A type reader.
 * @prop {string} type The type reader's type.
 * @prop {string} category The type reader's category.
 * @prop {string} description The type reader's description.
 */
class TypeReader {
  /**
   * @typedef {object} TypeReaderOptions The type reader options.
   * @prop {string} type The type reader's type.
   * @prop {string} [description=""] The type reader's description.
   */

  /**
   * @param {TypeReaderOptions} options The type reader options.
   */
  constructor(options) {
    this.category = TypeReaderCategory.User;
    this.type = options.type;
    this.description = options.description == null ? "" : options.description;
    this.constructor.validateTypeReader(this);
  }

  /**
   * Parses the argument's value.
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @param {Argument} argument The argument in question.
   * @param {object} args The currently resolved arguments.
   * @param {string} input The user's input.
   * @abstract
   * @returns {Promise<TypeReaderResult>} The type reader's result.
   */
  async read() {
    throw new ReferenceError(`${this.constructor.name} has no read method.`);
  }

  static validateTypeReader(typeReader) {
    if (typeof typeReader.type !== "string") {
      throw new TypeError(
        `${typeReader.constructor.name}: The type must be a string.`
      );
    } else if (typeof typeReader.description !== "string") {
      throw new TypeError(
        `${typeReader.constructor.name}: The description must be a string.`
      );
    }
  }
}

module.exports = TypeReader;
