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
import * as StringUtil from "../utils/StringUtil.js";
import * as ReaderUtil from "../utils/ReaderUtil.js";

/**
 * Parses a banned user.
 * @returns {TypeReaderResult<User>}
 */
const BannedUserReader = new TypeReader({type: "bannedUser"});

BannedUserReader.default = true;
BannedUserReader.read = async function(input, command, message, argument) {
  const bans = await lib.fetchBans(message.channel.guild);
  let value = input.match(regexes.userMention);

  if(value != null || (value = input.match(regexes.id)) != null) {
    value = value[value.length - 1];

    const match = lib.findBan(bans, ban => ban.user.id === value);

    if(match != null)
      return TypeReaderResult.fromSuccess(match.user);
  }

  value = input.toLowerCase();

  const matches = [];

  if(regexes.tag.test(value)) {
    for(let i = 0; i < bans.length; i++) {
      if(StringUtil.tag(bans[i].user) === value)
        matches.push(bans[i].user);
    }
  }

  if(matches.length === 0) {
    for(let i = 0; i < bans.length; i++) {
      if(bans[i].user.username.toLowerCase().includes(value))
        matches.push(bans[i].user);
    }
  }

  return ReaderUtil.handleMatches(
    command,
    matches,
    `You've provided an invalid ${argument.name}.`,
    StringUtil.safeTag
  );
};

export default BannedUserReader;
