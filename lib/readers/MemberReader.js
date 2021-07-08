/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  LJ Talbot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 2.1 of the
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
const IntegerReader = new TypeReader({type: "member"});

IntegerReader.default = true;
IntegerReader.read = async function(input, command, message, argument) {
  const lib = Registry.getLibrary();
  let value = input.match(regexes.userMention);

  if(value != null || (value = input.match(regexes.id)) != null) {
    let match;

    try {
      match = await lib.fetchMember(message, value[value.length - 1]);
    }catch(err) {
      if(err.code !== errors.unknownMember && err.code !== errors.unknownUser)
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

  for(const member of message.channel.guild.members.values()) {
    if(possibleTag) {
      const tag = strUtil.tag(member);

      if(tag === input) {
        matches = [member];

        break;
      }else if(tag.toLowerCase() === value) {
        if(which === 2) {
          matches.push(member);
        }else{
          which = 2;
          matches = [member];
        }
      }
    }else if(which !== 2 && (member.user.username === input || (member.nick ?? member.nickname) === input)) {
      if(which === 1) {
        matches.push(member);
      }else{
        which = 1;
        matches = [member];
      }
    }

    if(which === 0 && (member.user.username.toLowerCase().includes(value)
        || (member.nick ?? member.nickname)?.toLowerCase()?.includes(value)))
      matches.push(member);
  }

  return readerUtil.handleMatches(
    command,
    message,
    argument,
    matches,
    `You've provided an invalid ${argument.name}.`,
    member => strUtil.safeTag(member.user)
  );
};
module.exports = IntegerReader;
