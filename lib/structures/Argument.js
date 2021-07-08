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

class Argument {
  constructor(options) {
    if(invalidOptions(options))
      throw ReferenceError("The Argument constructor requires an options object.");

    this.defaultValue = options.defaultValue;
    this.optional = options.hasOwnProperty("defaultValue");
    this.example = options.example;
    this.infinite = options.infinite ?? false;
    this.key = options.key ?? options.type;
    this.name = options.name ?? options.type;
    this.preconditionOptions = options.preconditionOptions ?? [];
    this.preconditions = options.preconditions ?? [];
    this.remainder = options.remainder ?? false;
    this.type = options.type;
    this.typeOptions = options.typeOptions;
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

module.exports = Argument;
