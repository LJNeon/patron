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
const {errors, regexes} = require("../utils/constants.js");
const lib = require("../utils/libraryHandler.js");
const StringUtil = require("../utils/StringUtil.js");
const ReaderUtil = require("../utils/ReaderUtil.js");

/**
 * Parses a User.
 * @returns {TypeReaderResult<User>}
 */
const UserReader = new TypeReader({type: "user"});

UserReader.default = true;
UserReader.read = async function(input, command, message, argument) {
  const client = lib.getClient(message);
  let value = input.match(regexes.userMention);

  if(value != null || (value = input.match(regexes.id)) != null) {
    let match;

    try {
      match = await lib.fetchUser(client, value[value.length - 1]);
    }catch(err) {
      if(err.code !== errors.unknownUser)
        throw err;
    }

    if(match != null)
      return TypeReaderResult.fromSuccess(match);
  }

  const matches = [];

  if(regexes.tag.test(value)) {
    for(const user of client.users.values()) {
      if(StringUtil.tag(user).toLowerCase() === value)
        matches.push(user);
    }
  }

  if(matches.length === 0) {
    for(const user of client.users.values()) {
      if(user.username === input)
        matches.push(user);
    }
  }

  if(matches.length === 0) {
    value = input.toLowerCase();

    for(const user of client.users.values()) {
      if(user.username.toLowerCase().includes(value))
        matches.push(user);
    }
  }

  if(matches.length === 0 && message.channel.guild != null) {
    for(const member of message.channel.guild.members.values()) {
      if(member.nick === input)
        matches.push(member.user);
    }

    if(matches.length === 0) {
      for(const member of message.channel.guild.members.values()) {
        if(member.nick != null && member.nick.toLowerCase().includes(value))
          matches.push(member.user);
      }
    }
  }

  return ReaderUtil.handleMatches(
    command,
    message,
    argument,
    matches,
    `You've provided an invalid ${argument.name}.`,
    StringUtil.safeTag
  );

};

module.exports = UserReader;
