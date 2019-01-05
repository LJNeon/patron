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
const CommandError = require("../enums/CommandError.js");
const Result = require("./Result.js");

/**
 * A precondition result.
 * @extends {Result}
 */
class PreconditionResult extends Result {
  /**
   * Returns a successful precondition result.
   * @returns {PreconditionResult} The result in question.
   */
  static fromSuccess() {
    return new PreconditionResult({success: true});
  }

  /**
   * Returns a failed precondition result.
   * @param {Command} command The command being executed.
   * @param {string} reason The reason for the precondition failure.
   * @returns {PreconditionResult} The result in question.
   */
  static fromError(command, reason) {
    return new PreconditionResult({
      command,
      commandError: CommandError.Precondition,
      errorReason: reason,
      success: false
    });
  }
}

module.exports = PreconditionResult;
