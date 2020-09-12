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
const ResultType = {
  ArgumentCount: Symbol("ResultType.ArgumentCount"),
  ArgumentOrder: Symbol("ResultType.ArgumentOrder"),
  ClientPermission: Symbol("ResultType.ClientPermission"),
  Context: Symbol("ResultType.Context"),
  Cooldown: Symbol("ResultType.Cooldown"),
  Error: Symbol("ResultType.Error"),
  Execution: Symbol("ResultType.Execution"),
  MemberPermission: Symbol("ResultType.MemberPermission"),
  Precondition: Symbol("ResultType.Precondition"),
  Success: Symbol("ResultType.Success"),
  TypeReader: Symbol("ResultType.TypeReader"),
  Unknown: Symbol("ResultType.Unknown")
};

module.exports = ResultType;
