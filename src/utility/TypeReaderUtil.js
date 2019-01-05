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
const Constants = require("./Constants.js");
const StringUtil = require("./StringUtil.js");
const TypeReaderResult = require("../results/TypeReaderResult.js");

module.exports = {
  formatMatches(array, format) {
    return StringUtil.list(
      array.map(i => (format == null ? i.name : format(i)))
    );
  },

  handleMatches(cmd, matches, errMsg, format) {
    if (matches.length > Constants.config.maxMatches) {
      return TypeReaderResult.fromError(
        cmd,
        "Multiple matches found, please be more specific.",
        matches
      );
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(
        cmd,
        `Multiple matches found: ${this.formatMatches(matches, format)}.`,
        matches
      );
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(cmd, errMsg);
  }
};
