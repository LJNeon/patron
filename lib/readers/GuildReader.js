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
import {TypeReaderResult} from "../results/TypeReaderResult.js";
import {TypeReader} from "../structures/TypeReader.js";
import {regexes} from "../utils/constants.js";
import lib from "../utils/libraryHandler.js";
import * as ReaderUtil from "../utils/ReaderUtil.js";

/**
 * Parses a guild.
 * @returns {TypeReaderResult<Guild>}
 */
const GuildReader = new TypeReader({type: "guild"});

GuildReader.default = true;
GuildReader.read = function(input, command, message, argument) {
  const client = lib.getClient(message);
  let value = input.match(regexes.id);

  if(value != null) {
    const match = lib.getGuild(client, value);

    if(match != null)
      return TypeReaderResult.fromSuccess(match);
  }

  const matches = [];

  for(const guild of client.guilds.values()) {
    if(guild.name === input)
      matches.push(guild);
  }

  if(matches.length === 0) {
    value = input.toLowerCase();

    for(const guild of client.guilds.values()) {
      if(guild.name.toLowerCase().includes(value))
        matches.push(guild);
    }
  }

  return ReaderUtil.handleMatches(command, matches, `You've provided an invalid ${argument.name}.`);
};

export default GuildReader;