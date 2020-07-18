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
const TypeReaderResult = require("../results/TypeReaderResult.js");
const TypeReader = require("../structures/TypeReader.js");
const readerUtil = require("../utils/readerUtil.js");

module.exports = function(registry) {
  const CommandReader = new TypeReader({type: "command"});

  CommandReader.default = true;
  CommandReader.read = function(input, command, message, argument) {
    const value = input.toLowerCase();
    const match = registry.getCommand(input);

    if(match != null)
      return TypeReaderResult.fromSuccess(match);

    return readerUtil.handleMatches(
      command,
      message,
      argument,
      [...registry.commands.values()].filter(cmd => cmd.names.some(n => n.toLowerCase().includes(value))),
      `You've provided an invalid ${argument.name}.`,
      cmd => cmd.names[0]
    );
  };

  return CommandReader;
};
