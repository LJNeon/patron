/*
 * patron.js - The cleanest command framework for discord.js and eris.
 * Copyright (c) 2019 patron.js contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
const Constants = require("../../utility/Constants.js");
const TypeReader = require("../../structures/TypeReader.js");
const TypeReaderCategory = require("../../enums/TypeReaderCategory.js");
const TypeReaderResult = require("../../results/TypeReaderResult.js");
const units = Object.keys(Constants.times);

module.exports = new class TimeTypeReader extends TypeReader {
  constructor() {
    super({type: "time"});
    this.category = TypeReaderCategory.Global;
  }

  async read(cmd, msg, arg, args, val) {
    const number = val.match(Constants.regexes.number);

    if (number == null) {
      return TypeReaderResult.fromError(
        cmd,
        `You have provided an invalid ${arg.name}.`
      );
    }

    let result = Number(number[0]);

    if (Number.isNaN(result)) {
      return TypeReaderResult.fromError(
        cmd,
        `You have provided an invalid ${arg.name}.`
      );
    }

    const suffix = val.slice(number[0].length).trim().toLowerCase();
    const match = units.find(unit => suffix === unit
      || suffix === Constants.times[unit].plural
      || (Constants.times[unit].short != null
        && suffix === Constants.times[unit].short));

    if (suffix.length === 0) {
      result = Math.floor(result * Constants.times.minute.ms);
    } else if (match == null) {
      return TypeReaderResult.fromError(
        cmd,
        `You have provided an invalid ${arg.name}.`
      );
    } else {
      result = Math.floor(result * Constants.times[match].ms);
    }

    return TypeReaderResult.fromSuccess(result);
  }
}();
