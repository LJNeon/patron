/*
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
const Result = require("./Result.js");
const ResultType = require("../enums/ResultType.js");

class CommandResult extends Result {
  constructor(options) {
    super(options);
    this.name = options.name;
    this.count = options.count;
    this.unordered = options.unordered;
  }

  static fromArgumentCount(command, count) {
    return new CommandResult({command, count, type: ResultType.ArgumentCount});
  }

  static fromUnorderedArgument(command, argument) {
    return new CommandResult({command, unordered: argument, type: ResultType.ArgumentOrder});
  }

  static fromUnknown(name) {
    return new CommandResult({name, type: ResultType.Unknown});
  }
}

module.exports = CommandResult;
