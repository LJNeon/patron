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
 * An argument result.
 * @prop {object} args The parsed arguments.
 * @extends {Result}
 */
class ArgumentResult extends Result {
  /**
   * @typedef {object} ArgumentResultOptions The argument result
   * options.
   * @prop {object} args The parsed arguments.
   */

  /**
   * @param {ArgumentResultOptions} options The argument result options.
   */
  constructor(options) {
    super(options);
    this.args = options.args;
  }

  /**
   * Returns an invalid argument count result.
   * @param {Command} command The command being executed.
   * @returns {Result} The result in question.
   */
  static fromInvalidCount(command) {
    return new Result({
      command,
      commandError: CommandError.InvalidArgCount,
      errorReason: "You have provided an invalid number of arguments.",
      success: false
    });
  }

  /**
   * Returns a successful argument result.
   * @param {Command} command The command being executed.
   * @param {object} args The parsed values from all arguments.
   * @returns {ArgumentResult} The result in question.
   */
  static fromSuccess(command, args) {
    return new ArgumentResult({
      args,
      command,
      success: true
    });
  }
}

module.exports = ArgumentResult;
