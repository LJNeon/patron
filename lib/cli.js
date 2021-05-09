/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  LJ Talbot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 3 of the
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
const fs = require("fs");
const path = require("path");

function handleArgs(args) {
  const i = args.indexOf("--typings");

  if(i === -1)
    return false;

  const sep = args.charAt(i + 9);

  if(sep !== " " && sep !== "=")
    return false;

  const which = args.slice(i + 10);

  if(which !== "eris" && which !== "discordjs")
    return false;

  fs.copyFileSync(path.join(__dirname, `../types/${which}.d.ts`), path.join(__dirname, "../types/lib.d.ts"));
  console.info(`Configured patron typings to use ${which}.`);

  return true;
}

if(!handleArgs(process.argv.toLowerCase())) {
  console.error("Incorrect arguments provided. Expected --typings={eris | discordjs}.");
  process.exit(1);
}
