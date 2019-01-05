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

module.exports = new class ColorTypeReader extends TypeReader {
  constructor() {
    super({type: "color"});
    this.category = TypeReaderCategory.Global;
  }

  async read(cmd, msg, arg, args, val) {
    let match;

    if ((match = val.match(Constants.regexes.smallHex)) != null) {
      return TypeReaderResult.fromSuccess(Number(`0x${match[0]
        .slice(Constants.numbers.smallHexLength)
        .split("")
        .map(clr => clr.repeat(Constants.numbers.hexPiece))
        .join("")}`));
    } else if ((match = val.match(Constants.regexes.hex)) != null) {
      return TypeReaderResult.fromSuccess(
        Number(`0x${match[0].slice(Constants.numbers.hexLength)}`)
      );
    } else if ((match = val.match(Constants.regexes.rgb)) != null) {
      const r = Number(match[0].slice(
        match[0].indexOf("(") + 1,
        match[0].indexOf(",")
      ));

      match[0] = match[0].slice(match[0].indexOf(",") + 1).trim();

      const g = Number(match[0].slice(0, match[0].indexOf(",")));
      const b = Number(match[0].slice(
        match[0].indexOf(",") + 1,
        match[0].indexOf(")")
      ).trim());

      if (r > Constants.numbers.maxRGB || g > Constants.numbers.maxRGB
          || b > Constants.numbers.maxRGB) {
        return TypeReaderResult.fromError(
          cmd,
          Constants.errors.invalidArg(arg)
        );
      }

      return TypeReaderResult.fromSuccess(
        (r << Constants.conversions.rToHex)
          | (g << Constants.conversions.gToHex) | b
      );
    }

    return TypeReaderResult.fromError(
      cmd,
      `You have provided an invalid ${arg.name}.`
    );
  }
}();
