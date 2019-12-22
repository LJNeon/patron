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
import "./utils/libraryHandler.js";
import ArgumentDefault from "./enums/ArgumentDefault.js";
import Context from "./enums/Context.js";
import ResultType from "./enums/ResultType.js";
import CommandResult from "./results/CommandResult.js";
import ContextResult from "./results/ContextResult.js";
import CooldownResult from "./results/CooldownResult.js";
import ErrorResult from "./results/ErrorResult.js";
import ExecutionResult from "./results/ExecutionResult.js";
import PermissionResult from "./results/PermissionResult.js";
import PreconditionResult from "./results/PreconditionResult.js";
import Result from "./results/Result.js";
import TypeReaderResult from "./results/TypeReaderResult.js";
import Argument from "./structures/Argument.js";
import ArgumentPrecondition from "./structures/ArgumentPrecondition.js";
import Command from "./structures/Command.js";
import Cooldown from "./structures/Cooldown.js";
import Group from "./structures/Group.js";
import Handler from "./structures/Handler.js";
import Postcondition from "./structures/Postcondition.js";
import Precondition from "./structures/Precondition.js";
import Registry from "./structures/Registry.js";
import TypeReader from "./structures/TypeReader.js";
import Mutex from "./utils/Mutex.js";
import ImportAll from "./utils/ImportAll.mjs";

export {
  ArgumentDefault,
  Context,
  ResultType,
  CommandResult,
  ContextResult,
  CooldownResult,
  ErrorResult,
  ExecutionResult,
  PermissionResult,
  PreconditionResult,
  Result,
  TypeReaderResult,
  Argument,
  ArgumentPrecondition,
  Command,
  Cooldown,
  Group,
  Handler,
  Postcondition,
  Precondition,
  Registry,
  TypeReader,
  Mutex,
  ImportAll
};
