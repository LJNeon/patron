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
exports.ArgumentDefault = require("./enums/ArgumentDefault.js");
exports.Context = require("./enums/Context.js");
exports.ResultType = require("./enums/ResultType.js");
exports.CommandResult = require("./results/CommandResult.js");
exports.ContextResult = require("./results/ContextResult.js");
exports.CooldownResult = require("./results/CooldownResult.js");
exports.ErrorResult = require("./results/ErrorResult.js");
exports.ExecutionResult = require("./results/ExecutionResult.js");
exports.PermissionResult = require("./results/PermissionResult.js");
exports.PreconditionResult = require("./results/PreconditionResult.js");
exports.Result = require("./results/Result.js");
exports.TypeReaderResult = require("./results/TypeReaderResult.js");
exports.Argument = require("./structures/Argument.js");
exports.ArgumentPrecondition = require("./structures/ArgumentPrecondition.js");
exports.Command = require("./structures/Command.js");
exports.Cooldown = require("./structures/Cooldown.js");
exports.Group = require("./structures/Group.js");
exports.Handler = require("./structures/Handler.js");
exports.Postcondition = require("./structures/Postcondition.js");
exports.Precondition = require("./structures/Precondition.js");
exports.Registry = require("./structures/Registry.js");
exports.TypeReader = require("./structures/TypeReader.js");
exports.Mutex = require("./utils/Mutex.js");
exports.RequireAll = require("./utils/RequireAll.js").RequireAll;
exports.RequireAllSync = require("./utils/RequireAll.js").RequireAllSync;
