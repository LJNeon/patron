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
"use strict";
const TypeReaderResult = require("../results/TypeReaderResult.js");
const TypeReader = require("../structures/TypeReader.js");

/**
 * Parses an integer.
 * @returns {TypeReaderResult<Number>}
 */
const IntegerReader = new TypeReader({type: "int"});

IntegerReader.default = true;
IntegerReader.read = function(input, command, _, argument) {
  const value = Number(input);

  if(!Number.isInteger(value))
    return TypeReaderResult.fromFailure(command, `You've provided an invalid ${argument.name}.`);
  else if(value > Number.MAX_SAFE_INTEGER)
    return TypeReaderResult.fromFailure(command, "That number is too large.");
  else if(value < Number.MIN_SAFE_INTEGER)
    return TypeReaderResult.fromFailure(command, "That number is too small.");

  return TypeReaderResult.fromSuccess(value);
};

module.exports = IntegerReader;
