/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  LJ Talbot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 2.1 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
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
const {checkPrefix, partOf, invalidOptions} = require("../utils/structUtil.js");

class Handler {
  constructor(options) {
    if(invalidOptions(options))
      throw ReferenceError("The Handler constructor requires an options object.");

    this.defaultRegex = options.argumentRegex == null;
    this.argumentRegex = options.argumentRegex ?? regexes.argument;
    this.separator = options.separator ?? " ";
    this.registry = options.registry;
    Handler.validate(this);
  }

  parsePrefix(message) {
    const lib = Registry.getLibrary();
    const client = lib.getClient(message);
    const content = this.registry.toLowerCase(message.content);
    let prefixes;
    let hasPrefix = false;

    if(message.channel.guild != null) {
      prefixes = this.registry.prefixes.get(message.channel.guild.id);

      if(prefixes != null) {
        hasPrefix = true;

        const prefix = prefixes.find(p => checkPrefix(content, client.user.id, this.registry.toLowerCase(p)));

        if(prefix != null)
          return prefix === "@mention" ? `<@!${client.user.id}>` : prefix;
        else
          return;
      }
    }

    prefixes = this.registry.prefixes.get("global");

    if(prefixes == null) {
      if(hasPrefix)
        return;

      throw Error("No prefixes have been registered to Patron.");
    }

    const prefix = prefixes.find(p => checkPrefix(content, client.user.id, this.registry.toLowerCase(p)));

    if(prefix == null)
      return;

    return prefix === "@mention" ? `<@!${client.user.id}>` : prefix;
  }

  parseCommand(message, prefix) {
    const prefixLength = prefix?.length ?? this.parsePrefix(message)?.length;

    if(prefixLength == null)
      return CommandResult.fromUnknown("");

    let args = message.content.slice(prefixLength).match(this.argumentRegex);

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
    const lib = Registry.getLibrary();
    const result = lib.validateContext(message, command);

    if(result != null || message.channel.guild == null)
      return result;

    return lib.validatePermissions(message, command);
  }

  async useCooldowns(message, command) {
    let active = await command.useCooldowns(message);
    let group;

    if(active.every(a => !a)) {
      if(command.group == null)
        return;

      group = this.registry.getGroup(command.group);
      active = await group.useCooldowns(message);

      if(active.every(a => !a))
        return;
    }

    const cooldowns = (group ?? command).cooldowns.filter((v, i) => active[i]);
    const info = (await (group ?? command).getCooldowns(message)).filter((v, i) => active[i]);

    return CooldownResult.fromFailure(command, cooldowns, info, group != null);
  }

  async revertCooldowns(message, command) {
    await command.revertCooldowns(message);

    if(command.group != null)
      await this.registry.getGroup(command.group).revertCooldowns(message);
  }

  async runPreconditions(message, command) {
    if(!(command instanceof Command))
      command = this.registry.getCommand(command);

    if(command.group != null) {
      const group = this.registry.getGroup(command.group);

      for(let i = 0; i < group.preconditions.length; i++) {
        const result = await this.registry.getPrecondition(group.preconditions[i])
          .run(command, message, group.preconditionOptions[i]);

        if(result.type !== ResultType.Success)
          return result;
      }
    }

    for(let i = 0; i < command.preconditions.length; i++) {
      const result = await this.registry.getPrecondition(command.preconditions[i])
        .run(command, message, command.preconditionOptions[i]);

      if(result.type !== ResultType.Success)
        return result;
    }
  }

  async runArgumentPreconditions(message, command, info, parsed, value) {
    for(let i = 0; i < info.preconditions.length; i++) {
      result = await this.registry.getArgumentPrecondition(info.preconditions[i])
        .run(value, command, message, info, parsed, info.preconditionOptions[i]);

      if(result.type !== ResultType.Success)
        return result;
    }

    return value;
  }

  async validateArgument(message, command, info, parsed, input) {
    let result = await this.registry.getTypeReader(info.type).read(input, command, message, info, parsed, info.typeOptions);

    if(result.type !== ResultType.Success)
      return result;

    const {value} = result;

    result = await this.runArgumentPreconditions(message, command, info, parsed, value);

    if(result instanceof Result)
      return result;

    return value;
  }

  async parseArguments(message, command, args) {
    const parsed = {};
    let next = 0;

    for(let i = 0; i < command.arguments.length; i++) {
      const info = command.arguments[i];

      if(info.infinite) {
        parsed[info.key] = [];

        if(next >= args.length) {
          if(!info.optional)
            return CommandResult.fromArgumentCount(command, i);

          let result = this.default(message, info.defaultValue);

          if(partOf(ArgumentDefault, info.defaultValue)) {
            result = await this.runArgumentPreconditions(message, command, info, parsed, result);

            if(result instanceof Result)
              return result;
          }

          parsed[info.key].push(result);

          break;
        }

        for(let j = next; j < args.length; j++) {
          const result = await this.validateArgument(message, command, info, parsed, args[j]);

          if(result instanceof Result)
            return result;

          parsed[info.key].push(result);
        }

        continue;
      }else if(next >= args.length) {
        if(!info.optional)
          return CommandResult.fromArgumentCount(command, i);

        let result = this.default(message, info.defaultValue);

        if(partOf(ArgumentDefault, info.defaultValue)) {
          result = await this.runArgumentPreconditions(message, command, info, parsed, result);

          if(result instanceof Result)
            return result;
        }

        parsed[info.key] = result;

        continue;
      }else if(i > command.arguments.length - 1 && info.optional && command.arguments[i + 1].optional
          && !command.arguments[i + 1].infinite) {
        const list = command.arguments;
        const defaulted = [];
        let options = 2;

        for(let j = i + options; j < list.length; j++) {
          if(list[j].optional && !list[j].infinite)
            ++options;
          else
            break;
        }

        const size = i + options;

        for(; i < size; i++) {
          const input = list[i].remainder ? args.slice(next).join(this.separator) : args[next];
          let result = await this.validateArgument(message, command, list[i], parsed, input);

          if(result instanceof TypeReaderResult) {
            defaulted.push(i);
            result = this.default(message, info.defaultValue);

            if(partOf(ArgumentDefault, info.defaultValue)) {
              result = await this.runArgumentPreconditions(message, command, info, parsed, result);

              if(result instanceof Result)
                return result;
            }

            parsed[list[i].key] = result;
          }else if(result instanceof Result) {
            return result;
          }else{
            parsed[list[i].key] = result;
            ++next;
          }
        }

        if(next < i && args.length > next && !list[i - 1].remainder) {
          for(let k = 0; k < defaulted.length; k++) {
            for(let l = next; l < args.length; l++) {
              const result = await this.validateArgument(message, command, list[defaulted[k]], parsed, args[l]);

              if(!(result instanceof TypeReaderResult))
                return CommandResult.fromUnorderedArgument(command, list[defaulted[k]]);
            }
          }
        }

        --i;

        continue;
      }

      const input = info.remainder ? args.slice(next).join(this.separator) : args[next];
      let result = await this.validateArgument(message, command, info, parsed, input);

      if(result instanceof TypeReaderResult && info.optional && i !== command.arguments.length - 1) {
        result = this.default(message, info.defaultValue);

        if(partOf(ArgumentDefault, info.defaultValue)) {
          result = await this.runArgumentPreconditions(message, command, info, parsed, result);

          if(result instanceof Result)
            return result;
        }

        parsed[info.key] = result;
      }else if(result instanceof Result) {
        return result;
      }else{
        parsed[info.key] = result;
        ++next;
      }
    }

    return parsed;
  }

  async runPostconditions(message, command, value) {
    for(let i = 0; i < command.postconditions.length; i++) {
      await this.registry.getPostcondition(command.postconditions[i])
        .run(command, message, value, command.postconditionOptions[i]);
    }

    if(command.group == null)
      return;

    const group = this.registry.getGroup(command.group);

    for(let i = 0; i < group.postconditions.length; i++) {
      await this.registry.getPostcondition(group.postconditions[i])
        .run(command, message, value, group.postconditionOptions[i]);
    }
  }

  async executeCommand(message, command, args) {
    if(!(command instanceof Command))
      command = this.registry.getCommand(command);

    let result = this.validateCommand(message, command);

    if(result instanceof Result)
      return result;

    result = await this.useCooldowns(message, command);

    if(result instanceof Result)
      return result;

    let cooldown = true;

    try {
      result = await this.runPreconditions(message, command);

      if(result instanceof Result) {
        await this.revertCooldowns(message, command);

        return result;
      }

      result = await this.parseArguments(message, command, args);

      if(result instanceof Result) {
        await this.revertCooldowns(message, command);

        return result;
      }

      result = await command.run(message, result);

      if(result instanceof ExecutionResult) {
        if(result.type !== ResultType.Success) {
          await this.revertCooldowns(message, command);
          cooldown = false;
        }

        this.runPostconditions(message, command, result.value);
      }else{
        this.runPostconditions(message, command);
      }
    }catch(err) {
      if(cooldown)
        await this.revertCooldowns(message, command);

      return ErrorResult.fromFailure(command, err);
    }

    return Result.fromSuccess(command);
  }

  async run(message, prefix) {
    const result = this.parseCommand(message, prefix);

    if(result instanceof Result)
      return result;

    const {args, command} = result;

    return this.executeCommand(message, command, args);
  }

  default(message, value) {
    const lib = Registry.getLibrary();

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
