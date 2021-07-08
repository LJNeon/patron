/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  LJ Talbot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 2.1 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const TypeReaderResult = require("../results/TypeReaderResult.js");
const TypeReader = require("../structures/TypeReader.js");
const {regexes} = require("../utils/constants.js");
const readerUtil = require("../utils/readerUtil.js");
const UrlReader = new TypeReader({type: "url"});

UrlReader.default = true;
UrlReader.read = function(input, command, message, argument) {
  let value = input.replace(regexes.urlMarkdown, "");

  try {
    value = new URL(value);
  }catch{
    return readerUtil.handleFailure(command, message, argument, `You've provided an invalid ${argument.name}.`);
  }

  return TypeReaderResult.fromSuccess(value);
};
module.exports = UrlReader;
