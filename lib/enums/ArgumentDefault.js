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
/**
 * The contextual default values of an Argument.
 * @enum {Symbol}
 */
const ArgumentDefault = {
  /** The User who used the Command. */
  Author: Symbol("ArgumentDefault.Author"),
  /** The Channel the Command was used in. */
  Channel: Symbol("ArgumentDefault.Channel"),
  /** The Guild the Command was used in. */
  Guild: Symbol("ArgumentDefault.Guild"),
  /** The highest Role of the Member who used the Command. */
  HighestRole: Symbol("ArgumentDefault.HighestRole"),
  /** The Member who used the Command. */
  Member: Symbol("ArgumentDefault.Member"),
  /** The Command Message. */
  Message: Symbol("ArgumentDefault.Message")
};

module.exports = ArgumentDefault;
