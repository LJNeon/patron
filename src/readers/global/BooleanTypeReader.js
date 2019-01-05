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

module.exports = new class BooleanTypeReader extends TypeReader {
  constructor() {
    super({type: "bool"});
    this.category = TypeReaderCategory.Global;
  }

  async read(cmd, msg, arg, args, val) {
    const lowerValue = val.toLowerCase();

    if (Constants.trueValues.includes(lowerValue))
      return TypeReaderResult.fromSuccess(true);
    else if (Constants.falseValues.includes(lowerValue))
      return TypeReaderResult.fromSuccess(false);

    return TypeReaderResult.fromError(
      cmd,
      `You have provided an invalid ${arg.name}.`
    );
  }
}();
