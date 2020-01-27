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
require("./utils/libraryHandler.js");

module.exports = {
  ArgumentDefault: require("./enums/ArgumentDefault.js"),
  Context: require("./enums/Context.js"),
  ResultType: require("./enums/ResultType.js"),
  CommandResult: require("./results/CommandResult.js"),
  ContextResult: require("./results/ContextResult.js"),
  CooldownResult: require("./results/CooldownResult.js"),
  ErrorResult: require("./results/ErrorResult.js"),
  ExecutionResult: require("./results/ExecutionResult.js"),
  PermissionResult: require("./results/PermissionResult.js"),
  PreconditionResult: require("./results/PreconditionResult.js"),
  Result: require("./results/Result.js"),
  TypeReaderResult: require("./results/TypeReaderResult.js"),
  Argument: require("./structures/Argument.js"),
  ArgumentPrecondition: require("./structures/ArgumentPrecondition.js"),
  Command: require("./structures/Command.js"),
  Cooldown: require("./structures/Cooldown.js"),
  Group: require("./structures/Group.js"),
  Handler: require("./structures/Handler.js"),
  Postcondition: require("./structures/Postcondition.js"),
  Precondition: require("./structures/Precondition.js"),
  Registry: require("./structures/Registry.js"),
  TypeReader: require("./structures/TypeReader.js"),
  Mutex: require("./utils/Mutex.js"),
  RequireAll: require("./utils/RequireAll.js").RequireAll,
  RequireAllSync: require("./utils/RequireAll.js").RequireAllSync
};
