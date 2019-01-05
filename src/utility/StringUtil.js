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

module.exports = {
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  escapeMarkdown(str) {
    return str.replace(Constants.regexes.markdown, "\\$&");
  },

  list(arr, or = "and") {
    if (arr.length <= Constants.numbers.maxCommas)
      return arr.join(` ${or} `);

    return `${arr.slice(0, -1).join(", ")}, ${or} ${arr[arr.length - 1]}`;
  }
};
