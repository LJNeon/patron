/*
 * patron.js - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2019  patron.js contributors
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
import fs from "fs";
import path from "path";

function fixUrl(url) {
  return url.slice(url.includes("file:\\") ? 6 : 0, url.length);
}

const erisPath = fixUrl(path.join(import.meta.url, "../../types/eris.d.ts"));
const djsPath = fixUrl(path.join(import.meta.url, "../../types/djs.d.ts"));
const libPath = fixUrl(path.join(import.meta.url, "../../types/lib.d.ts"));

Promise.all([import("eris"), import("discord.js")]).catch(err => {
  if(err.message.includes("eris")) {
    fs.unlinkSync(erisPath);
    fs.renameSync(djsPath, libPath);
  }else{
    fs.unlinkSync(djsPath);
    fs.renameSync(erisPath, libPath);
  }
});
