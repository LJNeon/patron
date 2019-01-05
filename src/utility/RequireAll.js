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
const fs = require("fs");
const util = require("util");
const lStat = util.promisify(fs.lstat);
const readDir = util.promisify(fs.readdir);

/**
 * A function which returns all module exports of a folder.
 * @param {string} path The path in question.
 * @returns {Promise<Array<*>>} An array of all the module exports.
 */
async function RequireAll(path) {
  const files = await readDir(path);
  const modules = [];

  for (let i = 0; i < files.length; i++) {
    const parsedPath = `${path}/${files[i]}`;

    if ((await lStat(parsedPath)).isDirectory() && !files[i].startsWith("."))
      modules.push(...await RequireAll(parsedPath));
    else if (files[i].endsWith(".js") || files[i].endsWith(".json"))
      modules.push(require(parsedPath));
  }

  return modules;
}

module.exports = RequireAll;
