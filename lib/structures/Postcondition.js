/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  patron contributors
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
const {invalidOptions} = require("../utils/structUtil.js");

class Postcondition {
  constructor(options) {
    if(invalidOptions(options))
      throw ReferenceError("The Postcondition constructor requires an options object.");

    this.name = options.name;
    Postcondition.validate(this);
  }

  run() {
    throw ReferenceError("Postcondition#run must be a function.");
  }

  static validate(pcnd) {
    if(typeof pcnd.name !== "string")
      throw TypeError("Postcondition#name must be a string.");
  }
}

module.exports = Postcondition;
