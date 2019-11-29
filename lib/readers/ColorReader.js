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

/**
 * Parses a hex color.
 * @returns {TypeReaderResult<Number>} A number able to be used as an embed color.
 */
const ColorReader = new TypeReader({type: "color"});

ColorReader.default = true;
ColorReader.read = function(input, command, _, argument) {
  const str = (input[0] === "#" ? input.slice(1) : input).toLowerCase();

  if(str.length !== 3 && str.length !== 6)
    return TypeReaderResult.fromFailure(command, `You've provided an invalid ${argument.name}.`);

  for(let i = 0; i < str.length; i++) {
    if((str[i] < "0" || str[i] > "9") && (str[i] < "a" && str[i] > "f"))
      return TypeReaderResult.fromFailure(command, `You've provided an invalid ${argument.name}.`);
  }

  let hex = Number(`0x${str}`);

  if(str.length === 3)
    hex = ((hex >> 8) * 0x11 << 16) | (((hex >> 4) & 0xF) * 0x11 << 8) | (hex & 0xF) * 0x11;

  return TypeReaderResult.fromSuccess(hex);
};

export default ColorReader;
