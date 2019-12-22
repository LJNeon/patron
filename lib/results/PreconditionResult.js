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
const Result = require("./Result.js");
const ResultType = require("../enums/ResultType.js");

/**
 * A precondition result.
 * @extends {Result}
 * @prop {?String} reason The reason for the failure, or undefined if the result is successful.
 */
class PreconditionResult extends Result {
  /** @hideconstructor */
  constructor(options) {
    super(options);
    this.reason = options.reason;
    PreconditionResult.validate(this);
  }

  /**
   * Generates a successful precondition result.
   * @static
   * @returns {PreconditionResult} The successful precondition result.
   */
  static fromSuccess() {
    return new PreconditionResult({type: ResultType.Success});
  }

  /**
   * Generates a failed precondition result.
   * @static
   * @arg {Command} command The executed command.
   * @arg {String} reason The reason for the failure.
   * @returns {PreconditionResult} The failed precondition result.
   */
  static fromFailure(command, reason) {
    return new PreconditionResult({
      command,
      reason,
      type: ResultType.Precondition
    });
  }

  static validate(res) {
    if(res.type !== ResultType.Success && typeof res.reason !== "string")
      throw TypeError("PreconditionResult#reason must be a string.");
  }
}

module.exports = PreconditionResult;
