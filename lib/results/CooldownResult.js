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
 * A failure result due to a cooldown.
 * @extends {Result}
 * @prop {Number} remaining The amount of time remaining on the cooldown in milliseconds.
 * @prop {?Group} group The group the cooldown was on, or undefined if the cooldown was on a command.
 */
export class CooldownResult extends Result {
  /** @hideconstructor */
  constructor(options) {
    super(options);
    this.group = options.group;
    this.remaining = options.remaining;
  }

  static fromFailure(command, remaining, group) {
    return new CooldownResult({
      group,
      command,
      remaining,
      type: ResultType.Cooldown
    });
  }
}
