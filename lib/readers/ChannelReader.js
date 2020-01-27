/*
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2019  patron contributors
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
const {regexes} = require("../utils/constants.js");
const lib = require("../utils/libraryHandler.js");
const ReaderUtil = require("../utils/ReaderUtil.js");

/**
 * Parses a guild channel.
 * @returns {TypeReaderResult<GuildChannel>}
 */
const ChannelReader = new TypeReader({type: "channel"});

ChannelReader.default = true;
ChannelReader.read = async function(input, command, message, argument) {
  let value = input.match(regexes.channelMention);

  if(value != null || (value = input.match(regexes.id)) != null) {
    const match = lib.getChannel(message, value[value.length - 1]);

    if(match != null)
      return TypeReaderResult.fromSuccess(match);
  }

  const matches = [];

  for(const channel of message.channel.guild.channels.values()) {
    if(channel.name === input)
      matches.push(channel);
  }

  if(matches.length === 0) {
    value = input.toLowerCase();

    for(const channel of message.channel.guild.channels.values()) {
      if(channel.name.toLowerCase().includes(value))
        matches.push(channel);
    }
  }

  return ReaderUtil.handleMatches(
    command,
    message,
    argument,
    matches,
    `You've provided an invalid ${argument.name}.`,
    channel => channel.mention
  );
};

module.exports = ChannelReader;
