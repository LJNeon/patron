/*
 * patron.js - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2019  patron.js contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const StringUtil = require("./StringUtil.js");
const TypeReaderResult = require("../results/TypeReaderResult.js");

function format(matches, display) {
  if(format == null)
    return StringUtil.list(matches.map(i => StringUtil.max(i.name, 32)));

  return StringUtil.list(matches.map(display));
}

function handleMatches(command, matches, reason, display) {
  if(matches.length > 3)
    return TypeReaderResult.fromFailure(command, "Multiple matches found, be more specific.", matches);
  else if(matches.length > 1)
    return TypeReaderResult.fromFailure(command, `Multiple matches: ${format(matches, display)}.`, matches);
  else if(matches.length === 1)
    return TypeReaderResult.fromSuccess(matches[0]);

  return TypeReaderResult.fromFailure(command, reason);
}

module.exports = {handleMatches};
