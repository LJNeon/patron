/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  LJ Talbot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 2.1 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const {invalidOptions} = require("../utils/structUtil.js");

class Precondition {
  constructor(options) {
    if(invalidOptions(options))
      throw ReferenceError("The Precondition constructor requires an options object.");

    this.name = options.name;
    Precondition.validate(this);
  }

  run() {
    throw ReferenceError("Precondition#run must be a function.");
  }

  static validate(pcnd) {
    if(typeof pcnd.name !== "string")
      throw TypeError("Precondition#name must be a string.");
  }
}

module.exports = Precondition;
