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
 * A cooldown result.
 * @prop {number} remaining The time remaining on the command cooldown.
 * @extends {Result}
 */
class CooldownResult extends Result {
  /**
   * @typedef {object} CooldownResultOptions The cooldown result
   * options.
   * @prop {number} remaining The time remaining on the command cooldown.
   */

  /**
   * @param {CooldownResultOptions} options The cooldown result options.
   */
  constructor(options) {
    super(options);
    this.remaining = options.remaining;
  }

  /**
   * Returns a failed cooldown result.
   * @param {Command} command The command being executed.
   * @param {number} remaining The time remaining on the command cooldown.
   * @returns {CooldownResult} The result in question.
   */
  static fromError(command, remaining) {
    return new CooldownResult({
      command,
      commandError: CommandError.Cooldown,
      errorReason: "This command is on cooldown.",
      remaining,
      success: false
    });
  }
}

module.exports = CooldownResult;
