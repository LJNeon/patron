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
const Argument = require("./Argument.js");
const Cooldown = require("./Cooldown.js");
const Context = require("../enums/Context.js");
const {usageAsChannel, usageAsUser} = require("../utils/constants.js");
const InvalidOptions = require("../utils/InvalidOptions.js");

function partOf(enums, value) {
  for(const key in enums) {
    if(enums[key] === value)
      return true;
  }

  return false;
}

class Command {
  constructor(options) {
    if(InvalidOptions(options))
      throw ReferenceError("The Command constructor requires an options object.");

    this.arguments = options.arguments == null ? [] : options.arguments;
    this.arguments = this.arguments.map(arg => arg instanceof Argument ? arg : new Argument(arg));
    this.clientPermissions = options.clientPermissions == null ? [] : options.clientPermissions;
    this.cooldowns = options.cooldown == null ? undefined : new Cooldown(options.cooldown);
    this.description = options.description;
    this.group = options.group;
    this.memberPermissions = options.memberPermissions == null ? [] : options.memberPermissions;
    this.names = options.names;
    this.postconditionOptions = options.postconditionOptions == null ? [] : options.postconditionOptions;
    this.postconditions = options.postconditions == null ? [] : options.postconditions;
    this.preconditionOptions = options.preconditionOptions == null ? [] : options.preconditionOptions;
    this.preconditions = options.preconditions == null ? [] : options.preconditions;
    this.usableContexts = options.usableContexts == null ? [Context.Guild] : options.usableContexts;
    Command.validate(this);
  }

  run() {
    throw ReferenceError("Command#run must be a function.");
  }

  getExample(prefix = "") {
    let example = `${prefix}${this.names[0]}`;

    for(const arg of this.arguments) {
      if(arg.example == null)
        return;

      example += ` ${arg.example}`;
    }

    return example;
  }

  getUsage(prefix = "") {
    let usage = `${prefix}${this.names[0]}`;

    for(const arg of this.arguments) {
      let before = "<";
      let after = ">";

      if(arg.defaultValue != null) {
        before = "[";
        after = "]";
      }

      if(arg.infinite)
        before += "..";

      if(usageAsUser.some(str => arg.type.toLowerCase().includes(str)))
        before += "@";
      else if(usageAsChannel.some(str => arg.type.toLowerCase().includes(str)))
        before += "#";

      usage += ` ${before}${arg.name}${after}`;
    }

    return usage;
  }

  async getCooldown(userId, guildId) {
    if(this.cooldowns != null)
      return this.cooldowns.get(userId, guildId);
  }

  async useCooldown(userId, guildId) {
    if(this.cooldowns == null)
      return false;

    return this.cooldowns.use(userId, guildId);
  }

  async revertCooldown(userId, guildId) {
    if(this.cooldowns != null)
      this.cooldowns.revert(userId, guildId);
  }

  static validate(cmd) {
    if(!Array.isArray(cmd.arguments) || cmd.arguments.some(arg => !(arg instanceof Argument)))
      throw TypeError("Command#arguments must be an array of Arguments.");
    else if(!Array.isArray(cmd.clientPermissions) || cmd.clientPermissions.some(perm => typeof perm !== "string"))
      throw TypeError("Command#clientPermissions must be an array of strings.");
    else if(cmd.description != null && typeof cmd.description !== "string")
      throw TypeError("Command#description must be a string if defined.");
    else if(cmd.group != null && typeof cmd.group !== "string")
      throw TypeError("Command#group must be a string if defined.");
    else if(!Array.isArray(cmd.memberPermissions) || cmd.memberPermissions.some(perm => typeof perm !== "string"))
      throw TypeError("Command#memberPermissions must be an array of strings.");
    else if(!Array.isArray(cmd.names) || cmd.names.some(name => typeof name !== "string"))
      throw TypeError("Command#names must be an array of strings.");
    else if(!Array.isArray(cmd.postconditionOptions))
      throw TypeError("Command#postconditionOptions must be an array.");
    else if(!Array.isArray(cmd.postconditions) || cmd.postconditions.some(pcnd => typeof pcnd !== "string"))
      throw TypeError("Command#postconditions must be an array of strings.");
    else if(!Array.isArray(cmd.preconditionOptions))
      throw TypeError("Command#preconditionOptions must be an array.");
    else if(!Array.isArray(cmd.preconditions) || cmd.preconditions.some(pcnd => typeof pcnd !== "string"))
      throw TypeError("Command#preconditions must be an array of strings.");
    else if(!Array.isArray(cmd.usableContexts) || cmd.usableContexts.some(ctx => !partOf(Context, ctx)))
      throw TypeError("Command#usableContexts must be an array of Contexts.");
  }
}

module.exports = Command;
