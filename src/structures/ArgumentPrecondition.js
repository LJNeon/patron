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
 * An argument precondition.
 * @prop {string} name The argument precondition's name.
 * @prop {string} description The argument precondition's description.
 */
class ArgumentPrecondition {
  /**
   * @typedef {object} ArgumentPreconditionOptions The argument precondition
   * options.
   * @prop {string} name The argument precondition's name.
   * @prop {string} [description=""] The argument precondition's description.
   */

  /**
   * @param {ArgumentPreconditionOptions} options The argument precondition
   * options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description == null ? "" : options.description;
    this.constructor.validateArgumentPrecondition(this);
  }

  /**
   * Executes the argument precondition.
   * @param {Command} command The command being run.
   * @param {Message} message The received message.
   * @param {Argument} argument The argument in question.
   * @param {object} args The currently resolved arguments.
   * @param {*} value The argument's value.
   * @param {*} options The argument precondition's options.
   * @abstract
   * @returns {Promise<PreconditionResult>} The argument precondition's result.
   */
  async run() {
    throw new ReferenceError(`${this.constructor.name} has no run method.`);
  }

  static validateArgumentPrecondition(argumentPrecondition) {
    if (typeof argumentPrecondition.name !== "string") {
      throw new TypeError(
        `${argumentPrecondition.constructor.name}: The name must be a string.`
      );
    } else if (typeof argumentPrecondition.description !== "string") {
      throw new TypeError(
        `${argumentPrecondition.constructor.name}: The description must be a \
        string.`
      );
    }
  }
}

module.exports = ArgumentPrecondition;
