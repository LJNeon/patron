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
/**
 * The different possible results of Command execution.
 * @enum {Symbol}
 */
const ResultType = {
  /** The amount of Arguments provided was incorrect. */
  ArgumentCount: Symbol("ResultType.ArgumentCount"),
  /** The Client lacks required permissions. */
  ClientPermission: Symbol("ResultType.ClientPermission"),
  /** The Command was used in an invalid Context. */
  Context: Symbol("ResultType.Context"),
  /** The Command is on cooldown. */
  Cooldown: Symbol("ResultType.Cooldown"),
  /** An Error was thrown during the Command's execution. */
  Error: Symbol("ResultType.Error"),
  /** The Command failed when ran. */
  Execution: Symbol("ResultType.Execution"),
  /** The Member lacks required permissions. */
  MemberPermission: Symbol("ResultType.MemberPermission"),
  /** The Precondition failed when ran. */
  Precondition: Symbol("ResultType.Precondition"),
  /** The Command was successfully executed. */
  Success: Symbol("ResultType.Success"),
  /** The TypeReader failed when ran */
  TypeReader: Symbol("ResultType.TypeReader"),
  /** The Command used is unknown. */
  Unknown: Symbol("ResultType.Unknown")
};

module.exports = ResultType;
