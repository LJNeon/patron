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
let eris = false;
let djs = false;

try {
  require("eris");
  eris = true;
}catch{}

try {
  require("discord.js");
  djs = true;
}catch{}

if(eris && djs) {
  console.error("ReferenceError: Both eris and discord.js are installed, please uninstall one.");
  process.exit(1);
}else if(!(eris || djs)) {
  console.error("ReferenceError: Neither eris nor discord.js are installed, please install one.");
  process.exit(1);
}
