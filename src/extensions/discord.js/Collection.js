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
const discord = require("discord.js");

discord.Collection.prototype.filterValues = function(fn) {
  const results = [];

  for (const value of this.values()) {
    if (fn(value))
      results.push(value);
  }

  return results;
};
discord.Collection.prototype.findValue = function(fn) {
  for (const value of this.values()) {
    if (fn(value))
      return value;
  }
};
