/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  LJ Talbot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const Registry = require("../structures/Registry.js");
const TypeReaderResult = require("../results/TypeReaderResult.js");
const TypeReader = require("../structures/TypeReader.js");
const {regexes} = require("../utils/constants.js");
const readerUtil = require("../utils/readerUtil.js");
const RoleReader = new TypeReader({type: "role"});

RoleReader.default = true;
RoleReader.read = function(input, command, message, argument) {
  const lib = Registry.getLibrary();
  let value = input.match(regexes.roleMention);

  if(value != null || (value = input.match(regexes.id)) != null) {
    const match = lib.getRole(message, value[value.length - 1]);

    if(match != null)
      return TypeReaderResult.fromSuccess(match);
  }

  const matches = [];

  for(const role of message.channel.guild.roles.values()) {
    if(role.name === input)
      matches.push(role);
  }

  if(matches.length === 0) {
    value = input.toLowerCase();

    for(const role of message.channel.guild.roles.values()) {
      if(role.name.toLowerCase().includes(value))
        matches.push(role);
    }
  }

  return readerUtil.handleMatches(command, message, argument, matches, `You've provided an invalid ${argument.name}.`);
};
module.exports = RoleReader;
