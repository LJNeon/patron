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

function checkPrefix(message, client, prefix) {
  if(prefix === "@mention") {
    return message.content.startsWith(`<@!${client.user.id}> `)
      || message.content.startsWith(`<@${client.user.id}> `);
  }else{
    return message.content.startsWith(prefix);
  }
}

function invalidOptions(options, empty = false) {
  if(options?.constructor !== Object)
    return true;
  else if(empty)
    return false;

  for(const _ in options)
    return false;

  return true;
}

function partOf(enums, value) {
  for(const key in enums) {
    if(enums[key] === value)
      return true;
  }

  return false;
}

module.exports = {checkPrefix, invalidOptions, partOf};
