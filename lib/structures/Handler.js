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
const Registry = require("./Registry.js");
const ArgumentDefault = require("../enums/ArgumentDefault.js");
const ResultType = require("../enums/ResultType.js");
const CommandResult = require("../results/CommandResult.js");
const CooldownResult = require("../results/CooldownResult.js");
const ErrorResult = require("../results/ErrorResult.js");
const ExecutionResult = require("../results/ExecutionResult.js");
const Result = require("../results/Result.js");
const TypeReaderResult = require("../results/TypeReaderResult.js");
const Command = require("../structures/Command.js");
const {regexes} = require("../utils/constants.js");
const InvalidOptions = require("../utils/InvalidOptions.js");
const lib = require("../utils/libraryHandler.js");

function checkPrefix(message, client, prefix) {
  if(prefix === "@mention") {
    return message.content.startsWith(`<@!${client.user.id}>`)
      || message.content.startsWith(`<@${client.user.id}>`);
  }else{
    return message.content.startsWith(prefix);
  }
}

class Handler {
  constructor(options) {
    if(InvalidOptions(options))
      throw ReferenceError("The Handler constructor requires an options object.");

    this.defaultRegex = options.argumentRegex == null;
    this.argumentRegex = this.defaultRegex ? regexes.argument : options.argumentRegex;
    this.separator = options.separator == null ? " " : options.separator;
    this.registry = options.registry;
    Handler.validate(this);
  }

  parseCommand(message) {
    const client = lib.getClient(message);
    let prefix = this.registry.prefixes.get("global");

    if(prefix != null)
      prefix = prefix.find(p => checkPrefix(message, client, p));

    if(prefix == null && message.channel.guild != null) {
      prefix = this.registry.prefixes.get(message.channel.guild.id);

      if(prefix != null)
        prefix = prefix.find(p => checkPrefix(message, client, p));
    }

    if(prefix == null)
      return CommandResult.fromUnknown("");

    let args = message.content.slice(prefix.length).match(this.argumentRegex);

    if(args == null)
      return CommandResult.fromUnknown("");

    const command = this.registry.getCommand(args[0]);

    if(command == null)
      return CommandResult.fromUnknown(args[0]);
    else if(this.defaultRegex)
      args = args.slice(1).map(arg => arg.replace(regexes.quotes, ""));
    else
      args = args.slice(1);

    return {args, command};
  }

  validateCommand(message, command) {
    const result = lib.validateContext(message, command);

    if(result != null || message.channel.guild == null)
      return result;

    return lib.validatePermissions(message, command);
  }

  async useCooldown(message, command) {
    const guildId = message.channel.guild == null ? undefined : message.channel.guild.id;
    let cooldown = await command.useCooldown(message.author.id, guildId);
    let group;

    if(!cooldown) {
      if(command.group == null)
        return;

      group = this.registry.getGroup(command.group);
      cooldown = await group.useCooldown(message.author.id, guildId);

      if(!cooldown)
        return;
    }

    cooldown = await (group == null ? command : group).getCooldown(message.author.id, guildId);

    return CooldownResult.fromFailure(command, cooldown.resets - Date.now(), group);
  }

  async revertCooldown(message, command) {
    const guildId = message.channel.guild == null ? undefined : message.channel.guild.id;

    await command.revertCooldown(message.author.id, guildId);

    if(command.group != null)
      await this.registry.getGroup(command.group).revertCooldown(message.author.id, guildId);
  }

  async runPreconditions(message, command) {
    for(let i = 0; i < command.preconditions.length; i++) {
      const result = await this.registry.getPrecondition(command.preconditions[i])
        .run(command, message, command.preconditionOptions[i]);

      if(result.type !== ResultType.Success)
        return result;
    }

    if(command.group == null)
      return;

    const group = this.registry.getGroup(command.group);

    for(let i = 0; i < group.preconditions.length; i++) {
      const result = await this.registry.getPrecondition(group.preconditions[i])
        .run(command, message, group.preconditionOptions[i]);

      if(result.type !== ResultType.Success)
        return result;
    }
  }

  async validateArgument(message, command, info, parsed, input) {
    let result = await this.registry.getTypeReader(info.type).read(input, command, message, info, parsed);

    if(result.type !== ResultType.Success)
      return result;

    const {value} = result;

    for(let i = 0; i < info.preconditions.length; i++) {
      result = await this.registry.getArgumentPrecondition(info.preconditions[i])
        .run(value, command, message, info, parsed, info.preconditionOptions[i]);

      if(result.type !== ResultType.Success)
        return result;
    }

    return value;
  }

  async parseArguments(message, command, args) {
    const parsed = {};

    for(let i = 0; i < command.arguments.length; i++) {
      const info = command.arguments[i];

      if(info.infinite) {
        parsed[info.key] = [];

        if(i >= args.length) {
          if(!info.optional)
            return CommandResult.fromArgumentCount(command, i);

          parsed[info.key].push(this.default(message, info.defaultValue));

          break;
        }

        for(let j = i; j < args.length; j++) {
          const result = await this.validateArgument(message, command, info, parsed, args[j]);

          if(result instanceof Result)
            return result;

          parsed[info.key].push(result);
        }

        continue;
      }else if(i >= args.length) {
        if(!info.optional)
          return CommandResult.fromArgumentCount(command, i);

        parsed[info.key] = this.default(message, info.defaultValue);

        continue;
      }else if(info.optional && command.arguments[i + 1].optional) {
        const list = command.arguments;
        const defaulted = [];
        let options = command.arguments[i + 1].infinite ? 1 : 2;

        for(let j = i + options; j < list.length; j++) {
          if(list[j].optional && !list[j].infinite)
            ++options;
          else
            break;
        }

        const size = i + options;
        let j = i;

        for(; i < size; i++) {
          const input = list[i].remainder ? args.slice(j).join(this.separator) : args[j];
          const result = await this.validateArgument(message, command, list[i], parsed, input);

          if(result instanceof TypeReaderResult) {
            defaulted.push(i);
            parsed[list[i].key] = this.default(message, list[i].defaultValue);
          }else if(result instanceof Result) {
            return result;
          }else{
            parsed[list[i].key] = result;
            ++j;
          }
        }

        if(j < i && args.length > j && !list[i - 1].remainder) {
          for(let k = 0; k < defaulted.length; k++) {
            for(let l = j; l < args.length; l++) {
              const result = await this.validateArgument(message, command, list[defaulted[k]], parsed, args[l]);

              if(!(result instanceof TypeReaderResult))
                return CommandResult.fromUnorderedArgument(command, list[defaulted[k]]);
            }
          }
        }

        continue;
      }

      const input = info.remainder ? args.slice(i).join(this.separator) : args[i];
      const result = await this.validateArgument(message, command, info, parsed, input);

      if(result instanceof Result)
        return result;

      parsed[info.key] = result;
    }

    return parsed;
  }

  async runPostconditions(message, command, value) {
    for(let i = 0; i < command.postconditions.length; i++) {
      await this.registry.getPostcondition(command.postconditions[i])
        .run(message, value, command.postconditionOptions[i]);
    }

    if(command.group == null)
      return;

    const group = this.registry.getGroup(command.group);

    for(let i = 0; i < group.postconditions.length; i++) {
      await this.registry.getPostcondition(group.postconditions[i])
        .run(message, value, group.postconditionOptions[i]);
    }
  }

  async executeCommand(message, command, args) {
    if(!(command instanceof Command))
      command = this.registry.getCommand(command);

    let result = this.validateCommand(message, command);

    if(result instanceof Result)
      return result;

    result = await this.useCooldown(message, command);

    if(result instanceof Result)
      return result;

    let cooldown = true;

    try {
      result = await this.runPreconditions(message, command);

      if(result instanceof Result) {
        await this.revertCooldown(message, command);

        return result;
      }

      result = await this.parseArguments(message, command, args);

      if(result instanceof Result) {
        await this.revertCooldown(message, command);

        return result;
      }

      result = await command.run(message, result);

      if(result instanceof ExecutionResult) {
        if(result.type !== ResultType.Success) {
          await this.revertCooldown(message, command);
          cooldown = false;
        }

        this.runPostconditions(message, command, result.value);
      }else{
        this.runPostconditions(message, command);
      }
    }catch(err) {
      if(cooldown)
        await this.revertCooldown(message, command);

      return ErrorResult.fromFailure(command, err);
    }

    return Result.fromSuccess(command);
  }

  async run(message) {
    const result = this.parseCommand(message);

    if(result instanceof Result)
      return result;

    const {args, command} = result;

    return this.executeCommand(message, command, args);
  }

  default(message, value) {
    switch(value) {
      case ArgumentDefault.Author:
        return message.author;
      case ArgumentDefault.Channel:
        return message.channel;
      case ArgumentDefault.Guild:
        return message.channel.guild;
      case ArgumentDefault.HighestRole:
        return lib.highestRole(message);
      case ArgumentDefault.Member:
        return message.member;
      case ArgumentDefault.Message:
        return message;
      default:
        return value;
    }
  }

  static validate(handler) {
    if(!(handler.argumentRegex instanceof RegExp))
      throw TypeError("Handler#argumentRegex must be a regular expression if defined.");
    else if(typeof handler.separator !== "string")
      throw TypeError("Handler#separator must be a string if defined.");
    else if(!(handler.registry instanceof Registry))
      throw TypeError("Handler#registry must be a Registry.");
  }
}

module.exports = Handler;
