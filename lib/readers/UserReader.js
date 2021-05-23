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
const {errors, regexes} = require("../utils/constants.js");
const strUtil = require("../utils/strUtil.js");
const readerUtil = require("../utils/readerUtil.js");
const UserReader = new TypeReader({type: "user"});

UserReader.default = true;
UserReader.read = async function(input, command, message, argument) {
  const lib = Registry.getLibrary();
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

  const possibleTag = regexes.tag.test(input);
  let matches = [];
  // 2 = tag match, 1 = strict name match, 0 = loose name match
  let which = 0;

  value = input.toLowerCase();

  for(const user of client.users.values()) {
    if(possibleTag) {
      const tag = strUtil.tag(user);

      if(tag === input) {
        matches = [user];

        break;
      }else if(tag.toLowerCase() === value) {
        if(which === 2) {
          matches.push(user);
        }else{
          which = 2;
          matches = [user];
        }
      }
    }else if(which !== 2 && user.username === input) {
      if(which === 1) {
        matches.push(user);
      }else{
        which = 1;
        matches = [user];
      }
    }

    if(which === 0 && user.username.toLowerCase() === value)
      matches.push(user);
  }

  if(matches.length === 0 && message.channel.guild != null) {
    for(const member of message.channel.guild.members.values()) {
      if((member.nick ?? member.nickname) === input) {
        if(which === 1) {
          matches.push(member.user);
        }else{
          which = 1;
          matches = [member.user];
        }
      }else if(which === 0 && (member.nick ?? member.nickname)?.toLowerCase()?.includes(value)) {
        matches.push(member.user);
      }
    }
  }

  return readerUtil.handleMatches(
    command,
    message,
    argument,
    matches,
    `You've provided an invalid ${argument.name}.`,
    strUtil.safeTag
  );

};
module.exports = UserReader;
