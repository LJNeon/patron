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
import {regexes} from "./constants.js";

export function escapeMarkdown(string) {
  return string.replace(regexes.markdown, "\\$&");
}
export function list(items, sep = "and") {
  if(items.length < 3)
    return items.join(` ${sep} `);

  return `${items.slice(0, -1).join(", ")} ${sep} ${items[items.length - 1]}`;
}
export function max(string, amount) {
  if(string.length <= amount)
    return string;

  return `${string.slice(0, amount - 4)}...`;
}
export function tag(user) {
  return `${user.username}#${user.discriminator}`;
}
export function safeTag(user) {
  return `${this.escapeMarkdown(user.username)}#${user.discriminator}`;
}