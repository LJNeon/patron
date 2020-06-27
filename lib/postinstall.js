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
const {copyFileSync} = require("fs");
const {join} = require("path");

const erisPath = join(__dirname, "../types/eris.d.ts");
const djsPath = join(__dirname, "../types/djs.d.ts");
const libPath = join(__dirname, "../types/lib.d.ts");
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

if(eris)
  copyFileSync(erisPath, libPath);
else if(djs)
  copyFileSync(djsPath, libPath);
