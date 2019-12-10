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
import {Result} from "./Result.js";
import {ResultType} from "../enums/ResultType.js";

/**
 * A failure result from command parsing.
 * @extends {Result}
 * @prop {?String} name The name of the unknown command, if relevant.
 */
class CommandResult extends Result {
  /** @hideconstructor */
  constructor(options) {
    super(options);
    this.name = options.name;
  }

  static fromArgumentCount(command) {
    return new CommandResult({command, type: ResultType.ArgumentCount});
  }

  static fromUnknown(name) {
    return new CommandResult({name, type: ResultType.Unknown});
  }
}

export {CommandResult};
