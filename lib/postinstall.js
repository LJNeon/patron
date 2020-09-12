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
const fs = require("fs");
const path = require("path");
let which;

try {
  require("eris");
  which = "eris";
}catch{}

try {
  require("discord.js");
  which = "djs";
}catch{}

// Select the library-specific function implementations.
fs.copyFileSync(path.join(__dirname, `./utils/${which}Handler.js`), path.join(__dirname, "./utils/libraryHandler.js"));
// Select the library-specific typings.
fs.copyFileSync(path.join(__dirname, `../types/${which}.d.ts`), path.join(__dirname, "../types/lib.d.ts"));
