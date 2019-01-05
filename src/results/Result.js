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

/**
 * A result.
 * @prop {boolean} success Whether or not the command execution was successful.
 * @prop {?Command} command The executed command.
 * @prop {?string} commandName The parsed command name.
 * @prop {?CommandError} commandError The command error.
 * @prop {?string} errorReason The reason for the failed execution.
 */
class Result {
  /**
   * @typedef {object} ResultOptions The result options.
   * @prop {boolean} success Whether or not the command execution was
   * successful.
   * @prop {Command} [command] The executed command.
   * @prop {string} [commandName] The parsed command name.
   * @prop {CommandError} [commandError] The command error.
   * @prop {string} [errorReason] The reason for the failed execution.
   */

  /**
   * @param {ResultOptions} options The result options.
   */
  constructor(options) {
    this.success = options.success;
    this.command = options.command;

    if (this.command == null)
      this.commandName = options.commandName;
    else
      [this.commandName] = this.command.names;

    this.commandError = options.commandError;
    this.errorReason = options.errorReason;
  }

  /**
   * Returns a successful result.
   * @returns {Result} The result in question.
   */
  static fromSuccess(command) {
    return new Result({
      command,
      success: true
    });
  }
}

module.exports = Result;
