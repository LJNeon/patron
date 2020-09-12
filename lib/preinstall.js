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
const libs = [];

try {
  require("eris");
  libs.push("eris");
}catch{}

try {
  require("discord.js");
  libs.push("discord.js");
}catch{}

if(libs.length === 0)
  throw ReferenceError("Patron requires a Discord library (eris or discord.js) to be installed beforehand.");
else if(libs.length !== 1)
  throw ReferenceError("Patron can't run with multiple Discord libraries. Please uninstall eris or discord.js.");
