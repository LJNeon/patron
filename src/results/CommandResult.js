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
 * A command result.
 * @prop {*} data Information to be passed to the postconditions.
 * @extends {Result}
 */
class CommandResult extends Result {
  /**
   * @typedef {object} CommandResultOptions The command result
   * options.
   * @prop {*} data Information to be passed to the postconditions.
   */

  /**
   * @param {CommandResultOptions} options The command result options.
   */
  constructor(options) {
    super(options);
    this.data = options.data;
  }

  /**
   * Sets this result's command.
   * @param {Command} command The command this result came from.
   */
  setCommand(command) {
    this.command = command;
    [this.commandName] = command.names;
  }

  /**
   * Returns a failed command result.
   * @param {string} reason The reason for the command's failure.
   * @param {*} data Information to be passed to the postconditions.
   * @returns {CommandResult} The result in question.
   */
  static fromError(reason, data) {
    return new CommandResult({
      commandError: CommandError.Command,
      data,
      errorReason: reason,
      success: false
    });
  }

  /**
   * Returns an unknown command result.
   * @param {string} commandName The unknown command's name.
   * @returns {Result} The result in question.
   */
  static fromUnknown(commandName) {
    return new Result({
      commandError: CommandError.UnknownCmd,
      commandName,
      errorReason: "This command does not exist.",
      success: false
    });
  }
}

module.exports = CommandResult;
