/*!
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
const ColorReader = new TypeReader({type: "color"});

ColorReader.default = true;
ColorReader.read = function(input, command, message, argument) {
  const str = (input[0] === "#" ? input.slice(1) : input.startsWith("0x") ? input.slice(2) : input).toLowerCase();

  if(str.length !== 3 && str.length !== 6)
    return readerUtil.handleFailure(command, message, argument, `You've provided an invalid ${argument.name}.`);

  for(let i = 0; i < str.length; i++) {
    if((str[i] < "0" || str[i] > "9") && (str[i] < "a" && str[i] > "f"))
      return readerUtil.handleFailure(command, message, argument, `You've provided an invalid ${argument.name}.`);
  }

  let hex = Number(`0x${str}`);

  if(Number.isNaN(hex))
    return readerUtil.handleFailure(command, message, argument, `You've provided an invalid ${argument.name}.`);

  if(str.length === 3)
    hex = ((hex >> 8) * 0x11 << 16) | (((hex >> 4) & 0xF) * 0x11 << 8) | (hex & 0xF) * 0x11;

  return TypeReaderResult.fromSuccess(hex);
};
module.exports = ColorReader;
