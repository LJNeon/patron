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
module.exports = {
  Argument: require("./structures/Argument.js"),
  ArgumentDefault: require("./enums/ArgumentDefault.js"),
  ArgumentPrecondition: require("./structures/ArgumentPrecondition.js"),
  ArgumentResult: require("./results/ArgumentResult.js"),
  Command: require("./structures/Command.js"),
  CommandError: require("./enums/CommandError.js"),
  CommandResult: require("./results/CommandResult.js"),
  Context: require("./enums/Context.js"),
  CooldownResult: require("./results/CooldownResult.js"),
  ExceptionResult: require("./results/ExceptionResult.js"),
  Group: require("./structures/Group.js"),
  Handler: require("./structures/Handler.js"),
  InvalidContextResult: require("./results/InvalidContextResult.js"),
  Library: require("./enums/Library.js"),
  MultiMutex: require("./utility/MultiMutex.js"),
  Mutex: require("./utility/Mutex.js"),
  PermissionResult: require("./results/PermissionResult.js"),
  Postcondition: require("./structures/Postcondition.js"),
  Precondition: require("./structures/Precondition.js"),
  PreconditionResult: require("./results/PreconditionResult.js"),
  Registry: require("./structures/Registry.js"),
  RequireAll: require("./utility/RequireAll.js"),
  Result: require("./results/Result.js"),
  TypeReader: require("./structures/TypeReader.js"),
  TypeReaderResult: require("./results/TypeReaderResult.js"),
  version: require("../package.json").version
};
