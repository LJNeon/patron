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
const Constants = require("../utility/Constants.js");
const Result = require("./Result.js");
const StringUtil = require("../utility/StringUtil.js");

/**
 * A permission result.
 * @prop {object} permissions The missing permissions.
 * @extends {Result}
 */
class PermissionResult extends Result {
  /**
   * @typedef {object} PermissionResultOptions The permission
   * result options.
   * @prop {string[]} permissions The missing permissions.
   */

  /**
   * @param {PermissionResultOptions} options The permission result options.
   */
  constructor(options) {
    super(options);
    this.permissions = options.permissions;
  }

  /**
   * Formats an array of permissions into a list.
   * @param {string[]} permissions The permissions.
   * @returns {string} A list of the permissions.
   */
  format(permissions) {
    return StringUtil.list(permissions.map(permission => {
      const words = permission.match(Constants.regexes.word);

      for (let i = 0; i < words.length; i++) {
        words[i] = StringUtil.capitalize(words[i]);

        if (words[i] === "Guild") {
          words[i] = "Server";
        } else if (words[i] === "Vad") {
          words[i] = "Voice Activity";
        } else if (words[i] === "Voice") {
          words.splice(i, 1);
          i--;
        }
      }

      return words.join(" ");
    }));
  }

  /**
   * Returns a failed bot permissions result.
   * @param {Command} command The command being executed.
   * @param {string[]} permissions The missing permissions.
   * @returns {PermissionResult} The result in question.
   */
  static fromBot(command, permissions) {
    return new PermissionResult({
      command,
      commandError: CommandError.BotPermission,
      errorReason: "This command can't be executed due to lacking the \
      required permissions.",
      permissions,
      success: false
    });
  }

  /**
   * Returns a failed member permissions result.
   * @param {Command} command The command being executed.
   * @param {string[]} permissions The missing permissions.
   * @returns {PermissionResult} The result in question.
   */
  static fromMember(command, permissions) {
    return new Result({
      command,
      commandError: CommandError.MemberPermission,
      errorReason: "This command may only be used by members with the \
      required permissions.",
      permissions,
      success: false
    });
  }
}

module.exports = PermissionResult;
