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
 * The Command errors.
 * @enum {Symbol}
 * @readonly
 */
const CommandError = {
  /** The client lacking permissions. */
  BotPermission: Symbol("CommandError.BotPermission"),
  /** A command failure. */
  Command: Symbol("CommandError.Command"),
  /** A command used while on cooldown. */
  Cooldown: Symbol("CommandError.Cooldown"),
  /** An exception during command execution. */
  Exception: Symbol("CommandError.Exception"),
  /** An invalid amount of arguments provided. */
  InvalidArgCount: Symbol("CommandError.InvalidArgCount"),
  /** An invalid context for a command. */
  InvalidContext: Symbol("CommandError.InvalidContext"),
  /** A member lacking permissions. */
  MemberPermission: Symbol("CommandError.MemberPermission"),
  /** A precondition failure. */
  Precondition: Symbol("CommandError.Precondition"),
  /** A type reader failure. */
  TypeReader: Symbol("CommandError.TypeReader"),
  /** An unknown command. */
  UnknownCmd: Symbol("CommandError.UnknownCmd")
};

module.exports = CommandError;
