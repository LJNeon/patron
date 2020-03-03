/*
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  patron contributors
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
const strUtil = require("./strUtil.js");
const TypeReaderResult = require("../results/TypeReaderResult.js");

function format(matches, display) {
  if(display == null)
    return strUtil.list(matches.map(i => strUtil.max(i.name, 32)));

  return strUtil.list(matches.map(display));
}

async function handleFailure(cmd, msg, arg, reason, matches) {
  if(typeof arg.typeOptions === "function")
    return TypeReaderResult.fromFailure(cmd, await arg.typeOptions(msg, matches));

  return TypeReaderResult.fromFailure(cmd, reason);
}

function handleMatches(cmd, msg, arg, matches, reason, display) {
  if(matches.length > 3)
    return handleFailure(cmd, msg, arg, "Multiple matches found, be more specific.", matches);
  else if(matches.length > 1)
    return handleFailure(cmd, msg, arg, `Multiple matches: ${format(matches, display)}.`, matches);
  else if(matches.length === 1)
    return TypeReaderResult.fromSuccess(matches[0]);

  return handleFailure(cmd, msg, arg, reason);
}

module.exports = {handleFailure, handleMatches};
