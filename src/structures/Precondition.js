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
 * A command precondition.
 * @prop {string} name The name of the precondition.
 * @prop {string} description The description of the precondition.
 */
class Precondition {
  /**
   * @typedef {object} PreconditionOptions The preconditions options.
   * @prop {string} name The name of the precondition.
   * @prop {string} [description=""] The description of the precondition.
   */

  /**
   * @param {PreconditionOptions} options The preconditions options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description == null ? "" : options.description;
    this.constructor.validatePrecondition(this);
  }

  /**
   * Executes the precondition.
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @param {*} options The options of the precondition.
   * @abstract
   * @returns {Promise<PreconditionResult>} The result of the precondition.
   */
  async run() {
    throw new ReferenceError(`${this.constructor.name} has no run method.`);
  }

  static validatePrecondition(precondition) {
    if (typeof precondition.name !== "string") {
      throw new TypeError(
        `${precondition.constructor.name}: The name must be a string.`
      );
    } else if (typeof precondition.description !== "string") {
      throw new TypeError(
        `${precondition.constructor.name}: The description must be a string.`
      );
    }
  }
}

module.exports = Precondition;
