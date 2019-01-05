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
 * A type reader result.
 * @prop {?*} value The parsed value from the type reader.
 * @prop {?Array<*>} matches The type reader matches.
 * @extends {Result}
 */
class TypeReaderResult extends Result {
  /**
   * @typedef {object} TypeReaderResultOptions The type reader
   * result options.
   * @prop {*} [value] The parsed value from the type reader.
   * @prop {Array<*>} [matches] The type reader matches.
   */

  /**
   * @param {TypeReaderResultOptions} options The type reader result options.
   */
  constructor(options) {
    super(options);
    this.value = options.value;
    this.matches = options.matches;
  }

  /**
   * Returns a successful type reader result.
   * @param {*} value The parsed value from the type reader.
   * @returns {TypeReaderResult} The result in question.
   */
  static fromSuccess(value) {
    return new TypeReaderResult({
      success: true,
      value
    });
  }

  /**
   * Returns a failed type reader result.
   * @param {Command} command The command being executed.
   * @param {string} reason The reason for the type reader failure.
   * @param {Array<*>} [matches] The type reader matches.
   * @returns {TypeReaderResult} The result in question.
   */
  static fromError(command, reason, matches) {
    return new TypeReaderResult({
      command,
      commandError: CommandError.TypeReader,
      errorReason: reason,
      matches,
      success: false
    });
  }
}

module.exports = TypeReaderResult;
