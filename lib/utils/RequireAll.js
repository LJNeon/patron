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
const util = require("util");
const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);

async function RequireAll(dir) {
  const files = await readdir(dir);
  const modules = [];

  for(const file of files) {
    const loc = path.join(dir, file);

    if((await lstat(path.join(dir, file))).isDirectory() && !file.startsWith("."))
      modules.push(...await RequireAll(loc));
    else if(file.endsWith(".js"))
      modules.push(require(loc));
  }

  return modules;
}

const RequireAllSync = function(dir) {
  const files = fs.readdirSync(dir);
  const modules = [];

  for(const file of files) {
    const loc = path.join(dir, file);

    if(fs.lstatSync(loc).isDirectory() && !file.startsWith("."))
      modules.push(...RequireAllSync(loc));
    else if(file.endsWith(".js"))
      modules.push(require(loc));
  }

  return modules;
};

module.exports = {RequireAll, RequireAllSync};
