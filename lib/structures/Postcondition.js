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
"use strict";
const InvalidOptions = require("../utils/InvalidOptions.js");

/**
 * Executed after a Command is run and is provided the result.
 * @prop {String} name The postcondition's name.
 */
class Postcondition {
  /**
   * @arg {Object} options The Postcondition options.
   * @arg {String} options.name The postcondition's name.
   */
  constructor(options) {
    if(InvalidOptions(options))
      throw ReferenceError("The Postcondition constructor requires an options object.");

    this.name = options.name;
    Postcondition.validate(this);
  }

  /**
   * Executes the postconditon after a Command was run.
   * @abstract
   * @arg {Message} message The received message.
   * @arg {*} value A value that may be passed by the command's execution on failure.
   * @arg {*} options The postcondition's options provided by the Command or Group.
   * @returns {Promise} Resolves once the postcondition has been run.
   */
  run() {
    throw ReferenceError("Postcondition#run must be a function.");
  }

  static validate(pcnd) {
    if(typeof pcnd.name !== "string")
      throw TypeError("Postcondition#name must be a string.");
  }
}

module.exports = Postcondition;
