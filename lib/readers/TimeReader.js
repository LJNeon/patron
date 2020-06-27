/*
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
const {times} = require("../utils/constants.js");
const readerUtil = require("../utils/readerUtil.js");

const units = new Map();

for(const unit in times) {
  if(!(unit in times))
    continue;

  units.set(unit, unit);
  units.set(times[unit].plural, unit);
}

for(const unit in times) {
  if(!(unit in times))
    continue;

  if(times[unit].short != null)
    units.set(times[unit].short, unit);
}

const TimeReader = new TypeReader({type: "time"});

TimeReader.default = true;
TimeReader.read = function(input, command, message, argument) {
  let {ms} = times.minute;
  let value = input;

  for(const unit of units.keys()) {
    if(value.slice(-unit.length, value.length) === unit) {
      ({ms} = times[units.get(unit)]);
      value = value.slice(0, -unit.length).trim();

      break;
    }
  }

  if(value.length === 0)
    return TypeReaderResult.fromSuccess(ms);

  value = Number(value);

  if(Number.isNaN(value) || value > 1e3 || value < 0.01)
    return readerUtil.handleFailure(command, message, argument, `You've provided an invalid ${argument.name}.`);

  return TypeReaderResult.fromSuccess(Math.floor(value * ms));
};

module.exports = TimeReader;
