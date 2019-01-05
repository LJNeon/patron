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
/**
 * The Argument defaults.
 * @enum {Symbol}
 * @readonly
 */
const ArgumentDefault = {
  /** The author of the command message. */
  Author: Symbol("ArgumentDefault.Author"),
  /** The channel of the command message. */
  Channel: Symbol("ArgumentDefault.Channel"),
  /** The guild of the command message. */
  Guild: Symbol("ArgumentDefault.Guild"),
  /** The highest role of the author of the command message. */
  HighestRole: Symbol("ArgumentDefault.HighestRole"),
  /** The guild member of the author of the command message. */
  Member: Symbol("ArgumentDefault.Member"),
  /** The command message. */
  Message: Symbol("ArgumentDefault.Message")
};

module.exports = ArgumentDefault;
