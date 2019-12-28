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
const {errors, regexes} = require("../utils/constants.js");
const lib = require("../utils/libraryHandler.js");
const ReaderUtil = require("../utils/ReaderUtil.js");

/**
 * Parses a message.
 * @returns {TypeReaderResult<Message>}
 */
const MessageReader = new TypeReader({type: "message"});

MessageReader.default = true;
MessageReader.read = async function(input, command, message, argument) {
  let value = input.test(regexes.id);

  if(value) {
    let match;

    try {
      match = await lib.fetchMessage(message, input);
    }catch(err) {
      if(err.code !== errors.unknownMessage)
        throw err;
    }

    if(match != null)
      return TypeReaderResult.fromSuccess(match);
  }

  const matches = [];

  for(const msg of message.channel.messages.values()) {
    if(msg.content === input)
      matches.push(msg);
  }

  if(matches.length === 0) {
    value = input.toLowerCase();

    for(const msg of message.channel.messages.values()) {
      if(msg.content.toLowerCase().includes(value))
        matches.push(msg);
    }
  }

  return ReaderUtil.handleMatches(
    command,
    matches,
    `You've provided an invalid ${argument.name}`,
    msg => msg.id
  );
};

module.exports = MessageReader;
