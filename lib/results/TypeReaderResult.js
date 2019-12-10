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
 * A type reader result.
 * @extends {Result}
 * @prop {?Array<*>} matches A list of all parsed values, or undefined if fewer than 2 values were parsed.
 * @prop {?String} reason The reason for the failure, or undefined if the result is successful.
 * @prop {?*} value The value parsed by the type reader.
 */
class TypeReaderResult extends Result {
  /** @hideconstructor */
  constructor(options) {
    super(options);
    this.matches = options.matches;
    this.reason = options.reason;
    this.value = options.value;
    TypeReaderResult.validate(this);
  }

  /**
   * Generates a successful type reader result.
   * @static
   * @arg {*} value The value parsed by the type reader.
   * @returns {TypeReaderResult} The successful type reader result.
   */
  static fromSuccess(value) {
    return new TypeReaderResult({type: ResultType.Success, value});
  }

  /**
   * Generates a failed type reader result.
   * @static
   * @arg {Command} command The executed command.
   * @arg {String} reason The reason for the failure.
   * @arg {Array<*>} [matches] A list of all parsed values, or undefined if fewer than 2 values were parsed.
   * @returns {TypeReaderResult} The failed type reader result.
   */
  static fromFailure(command, reason, matches) {
    return new TypeReaderResult({
      command,
      matches,
      reason,
      type: ResultType.TypeReader
    });
  }

  static validate(res) {
    if(res.matches != null && !Array.isArray(res.matches))
      throw TypeError("TypeReaderResult#matches must be an array if defined.");
    else if(res.type !== ResultType.Success && typeof res.reason !== "string")
      throw TypeError("TypeReaderResult#reason must be a string.");
  }
}

export {TypeReaderResult};
