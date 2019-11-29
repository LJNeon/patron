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
 * Parses a custom emoji. (not unicode emojis)
 * @returns {TypeReaderResult<Emoji>}
 */
const EmojiReader = new TypeReader({type: "emoji"});

EmojiReader.default = true;
EmojiReader.read = function(input, command, message, argument) {
  const client = lib.getClient(message);
  let value = input.match(regexes.emoji);

  if(value != null) {
    const match = lib.findEmojis(client, emoji => emoji.name === value[1] && emoji.id === value[2]);

    if(match != null)
      return TypeReaderResult.fromSuccess(match);
  }

  let matches = lib.filterEmojis(client, emoji => emoji.name === input);

  if(matches.length === 0) {
    value = input.toLowerCase();
    matches = lib.filterEmojis(client, emoji => emoji.name.toLowerCase().includes(value));
  }

  return ReaderUtil.handleMatches(
    command,
    matches,
    `You've provided an invalid ${argument.name}.`,
    emoji => `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`
  );
};

export default EmojiReader;
