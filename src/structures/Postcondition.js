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

/**
 * A command postcondition.
 * @prop {string} name The name of the postcondition.
 * @prop {string} description The description of the postcondition.
 */
class Postcondition {
  /**
   * @typedef {object} PostconditionOptions The postconditions options.
   * @prop {string} name The name of the postcondition.
   * @prop {string} [description=""] The description of the postcondition.
   */

  /**
   * @param {PostconditionOptions} options The postconditions options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description == null ? "" : options.description;
    this.constructor.validatePostcondition(this);
  }

  /**
   * Executes the postcondition.
   * @param {Message} message The received message.
   * @param {*} [result] The result of the command execution, if any.
   * @param {*} options The options of the postcondition.
   * @abstract
   */
  async run() {
    throw new ReferenceError(`${this.constructor.name} has no run method.`);
  }

  static validatePostcondition(postcondition) {
    if (typeof postcondition.name !== "string") {
      throw new TypeError(
        `${postcondition.constructor.name}: The name must be a string.`
      );
    } else if (typeof postcondition.description !== "string") {
      throw new TypeError(
        `${postcondition.constructor.name}: The description must be a string.`
      );
    }
  }
}

module.exports = Postcondition;
