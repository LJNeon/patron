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
 * An invalid context result.
 * @extends {Result}
 */
class InvalidContextResult extends Result {
  /**
   * @typedef {object} InvalidContextResultOptions The
   * invalid context result options.
   * @prop {Symbol} context The invalid context in question.
   */

  /**
   * @param {InvalidContextResultOptions} options The invalid context result
   * options.
   */
  constructor(options) {
    super(options);
    this.context = options.context;
  }

  /**
   * Returns an invalid context result.
   * @param {Command} command The command being executed.
   * @param {Symbol} context The invalid context in question.
   * @returns {InvalidContextResult} The result in question.
   */
  static fromError(command, context) {
    return new InvalidContextResult({
      command,
      commandError: CommandError.InvalidContext,
      context,
      errorReason: "This command may not be used in that context.",
      success: false
    });
  }
}

module.exports = InvalidContextResult;
