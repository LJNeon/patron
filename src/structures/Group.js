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
 * A command group.
 * @prop {Command[]} commands An array of all commands inside the group.
 * @prop {string} description The description of the group.
 * @prop {string} name The name of the group.
 * @prop {Array<*>} postconditionOptions The options to be passed to
 * postconditions when they're run.
 * @prop {Postcondition[]} postconditions The postconditions to be run on all
 * commands inside the group.
 * @prop {Array<*>} preconditionOptions The options to be passed to
 * preconditions when they're run.
 * @prop {Precondition[]} preconditions The preconditions to be run on all
 * commands inside the group.
 */
class Group {
  /**
   * @typedef {object} GroupOptions The group options.
   * @prop {string} [description=""] The description of the group.
   * @prop {string} name The name of the group.
   * @prop {Array<*>} [postconditionOptions=[]] The options to be passed to
   * postconditions when they're run.
   * @prop {string[]} [postconditions=[]] The postconditions to be run on all
   * commands inside the group.
   * @prop {Array<*>} [preconditionOptions=[]] The options to be passed to
   * preconditions when they're run.
   * @prop {string[]} [preconditions=[]] The preconditions to be run on all
   * commands inside the group.
   */

  /**
   * @param {GroupOptions} options The group options.
   */
  constructor(options) {
    this.commands = [];
    this.description = options.description == null ? "" : options.description;
    this.name = options.name;

    if (options.preconditionOptions == null)
      this.preconditionOptions = [];
    else
      this.preconditionOptions = options.preconditionOptions;

    if (options.preconditions == null)
      this.preconditions = [];
    else
      this.preconditions = options.preconditions;

    if (options.postconditionOptions == null)
      this.postconditionOptions = [];
    else
      this.postconditionOptions = options.postconditionOptions;

    if (options.postconditions == null)
      this.postconditions = [];
    else
      this.postconditions = options.postconditions;

    this.constructor.validateGroup(this);
  }

  static validateGroup(group) {
    if (typeof group.description !== "string") {
      throw new TypeError(
        `${group.constructor.name}: The description must be a string.`
      );
    } else if (typeof group.name !== "string") {
      throw new TypeError(
        `${group.constructor.name}: The name must be a string.`
      );
    } else if (!Array.isArray(group.postconditionOptions)) {
      throw new TypeError(
        `${group.constructor.name}: The postcondition options must be an \
        array.`
      );
    } else if (!Array.isArray(group.postconditions)
        || group.postconditions.some(p => typeof p !== "string")) {
      throw new TypeError(
        `${group.constructor.name}: The postconditions must be an array of \
        strings.`
      );
    } else if (!Array.isArray(group.preconditionOptions)) {
      throw new TypeError(
        `${group.constructor.name}: The precondition options must be an array.`
      );
    } else if (!Array.isArray(group.preconditions)
        || group.preconditions.some(p => typeof p !== "string")) {
      throw new TypeError(
        `${group.constructor.name}: The preconditions must be an array of \
        strings.`
      );
    }
  }
}

module.exports = Group;
