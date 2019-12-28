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
const {falsey, truthy} = require("../utils/constants.js");

/**
 * Parses a boolean.
 * @returns {TypeReaderResult<Boolean>}
 */
const BooleanReader = new TypeReader({type: "bool"});

BooleanReader.default = true;
BooleanReader.read = function(input, command, _, argument) {
  const value = input.toLowerCase();

  if(truthy.includes(value))
    return TypeReaderResult.fromSuccess(true);
  else if(falsey.includes(value))
    return TypeReaderResult.fromSuccess(false);

  return TypeReaderResult.fromFailure(command, `You've provided an invalid ${argument.name}.`);
};

module.exports = BooleanReader;
