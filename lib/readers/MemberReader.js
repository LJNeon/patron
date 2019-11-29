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
import {errors, regexes} from "../utils/constants.js";
import lib from "../utils/libraryHandler.js";
import * as StringUtil from "../utils/StringUtil.js";
import * as ReaderUtil from "../utils/ReaderUtil.js";

/**
 * Parses a guild member.
 * @returns {TypeReaderResult<Member>}
 */
const IntegerReader = new TypeReader({type: "member"});

IntegerReader.default = true;
IntegerReader.read = async function(input, command, message, argument) {
  let value = input.match(regexes.userMention);

  if(value != null || (value = input.match(regexes.id)) != null) {
    let match;

    try {
      match = await lib.fetchMember(message, value[value.length - 1]);
    }catch(err) {
      if(err.code !== errors.unknownMember)
        throw err;
    }

    if(match != null)
      return TypeReaderResult.fromSuccess(match);
  }

  const matches = [];

  if(regexes.tag.test(value)) {
    for(const member of message.channel.guild.members.values()) {
      if(StringUtil.tag(member).toLowerCase() === value)
        matches.push(member);
    }
  }

  if(matches.length === 0) {
    for(const member of message.channel.guild.members.values()) {
      if(member.user.username === input || member.nick === input)
        matches.push(member);
    }
  }

  if(matches.length === 0) {
    value = input.toLowerCase();

    for(const member of message.channel.guild.members.values()) {
      if(member.user.username.toLowerCase().includes(value)
          || (member.nick != null && member.nick.toLowerCase().includes(value)))
        matches.push(member);
    }
  }

  return ReaderUtil.handleMatches(
    command,
    matches,
    `You've provided an invalid ${argument.name}.`,
    member => StringUtil.safeTag(member.user)
  );
};

export default IntegerReader;
