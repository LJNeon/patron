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
 * An exception result.
 * @prop {Error} error The error in question.
 * @extends {Result}
 */
class ExceptionResult extends Result {
  /**
   * @typedef {object} ExceptionResultOptions
   * @prop {Error} error The error in question.
   */

  /**
   * @param {ExceptionResultOptions} options The exception result options.
   */
  constructor(options) {
    super(options);
    this.error = options.error;
  }

  /**
   * Returns an exception result.
   * @param {Command} command The command being executed.
   * @param {Error} error The error in question.
   * @returns {TypeReaderResult} The result in question.
   */
  static fromError(command, error) {
    return new ExceptionResult({
      command,
      commandError: CommandError.Exception,
      error,
      errorReason: error.message,
      success: false
    });
  }
}

module.exports = ExceptionResult;
