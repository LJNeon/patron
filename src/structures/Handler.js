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
const ArgumentDefault = require("../enums/ArgumentDefault.js");
const ArgumentResult = require("../results/ArgumentResult.js");
const CommandResult = require("../results/CommandResult.js");
const Constants = require("../utility/Constants.js");
const CooldownResult = require("../results/CooldownResult.js");
const ExceptionResult = require("../results/ExceptionResult.js");
const Registry = require("./Registry.js");
const Result = require("../results/Result.js");

/**
 * The command handler.
 * @prop {RegExp} argumentRegex The regex used to parse arguments from
 * messages.
 * @prop {Registry} registry The registry used to store the commands.
 */
class Handler {
  /**
   * @typedef {object} HandlerOptions The handler options.
   * @prop {RegExp} [argumentRegex=/"[\S\s]+?"|[\S\n]+/g] The regex used to
   * parse arguments from messages.
   * @prop {Registry} registry The registry used to store the commands.
   */

  /**
   * @param {HandlerOptions} options The handler options.
   */
  constructor(options) {
    this.registry = options.registry;

    if (options.argumentRegex == null) {
      this.argumentRegex = Constants.regexes.argument;
      this.hasDefaultRegex = true;
    } else {
      this.argumentRegex = options.argumentRegex;
      this.hasDefaultRegex = this.argumentRegex === Constants.regexes.argument;
    }

    this.constructor.validateHandler(this);
  }

  /**
   * Attempts to parse a Command.
   * @param {Message} message The received message.
   * @param {number} prefixLength The length of the prefix to use when handling
   * the command.
   * @returns {Promise<Result>} The result of the command parsing.
   */
  async parseCommand(message, prefixLength) {
    const content = message.content.slice(prefixLength);
    const split = content.match(this.argumentRegex);

    if (split == null
        || content.match(Constants.regexes.startWhitespace) != null)
      return CommandResult.fromUnknown("");

    const command = this.registry.commands.find(
      cmd => cmd.names.some(name => this.registry.equals(name, split[0]))
    );

    if (command == null)
      return CommandResult.fromUnknown(split[0]);

    return Result.fromSuccess(command);
  }

  /**
   * Attempts to validate a Command.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @returns {Promise<InvalidContextResult|Result>} The result of the command
   * validation.
   */
  async validateCommand(message, command) {
    let result = this.registry.libraryHandler.validateContext(
      command,
      message
    );

    if (result != null)
      return result;

    result = this.registry.libraryHandler.validatePermissions(
      command,
      message
    );

    if (result != null)
      return result;

    return Result.fromSuccess(command);
  }

  /**
   * Attempts to run the Preconditions registered to a Command.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @returns {Promise<PreconditionResult|Result>} The result of running the
   * preconditions.
   */
  async runCommandPreconditions(message, command) {
    for (let i = 0; i < command.group.preconditions.length; i++) {
      const result = await command.group.preconditions[i].run(
        command,
        message,
        command.group.preconditionOptions[i]
      );

      if (!result.success)
        return result;
    }

    for (let i = 0; i < command.preconditions.length; i++) {
      const result = await command.preconditions[i].run(
        command,
        message,
        command.preconditionOptions[i]
      );

      if (!result.success)
        return result;
    }

    return Result.fromSuccess(command);
  }

  /**
   * Attempts to run the Postconditions registered to a Command.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @param {*} result The command result.
   */
  async runCommandPostconditions(message, command, result) {
    if (result instanceof CommandResult)
      result.setCommand(command);

    for (let i = 0; i < command.group.postconditions.length; i++) {
      await command.group.postconditions[i].run(
        message,
        result,
        command.group.postconditionOptions[i]
      );
    }

    for (let i = 0; i < command.postconditions.length; i++) {
      await command.postconditions[i].run(
        message,
        result,
        command.postconditionOptions[i]
      );
    }
  }

  /**
   * Attempts to update a Command's cooldown.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @returns {Promise<CooldownResult|Result>} The result of checking
   * the cooldowns.
   */
  async updateCooldown(message, command) {
    let guild = this.registry.libraryHandler.guild(message);

    guild = guild == null ? null : guild.id;

    let cooldown = await command.updateCooldown(message.author.id, guild);

    if (!cooldown)
      return Result.fromSuccess(command);

    cooldown = await command.cooldowns.get(message.author.id, guild);

    return CooldownResult.fromError(command, cooldown.resets - Date.now());
  }

  async parseInfiniteArg(message, command, i, args, split) {
    const value = [];
    const input = split;

    if (input.length === 0) {
      if (command.args[i].optional)
        return this.defaultValue(command.args[i].defaultValue, message);

      return ArgumentResult.fromInvalidCount(command);
    }

    for (let j = 0; j < input.length; j++) {
      if (this.hasDefaultRegex && input != null)
        input[j] = input[j].replace(Constants.regexes.quotes, "");

      const typeReaderResult = await command.args[i].typeReader.read(
        command,
        message,
        command.args[i],
        args,
        input[j]
      );

      if (!typeReaderResult.success)
        return typeReaderResult;

      value.push(typeReaderResult.value);

      const res = await this.runArgPreconditions(
        message,
        command,
        i,
        args,
        typeReaderResult.value
      );

      if (res != null)
        return res;
    }

    return value;
  }

  async parseFiniteArg(msg, cmd, i, args, content, split) {
    let input = content;
    let newContent = content;

    if (!cmd.args[i].remainder) {
      input = split.shift();

      if (input != null) {
        if (split.length > 0)
          newContent = content.slice(content.indexOf(split[0], input.length));
        else
          newContent = "";
      }
    }

    if (this.hasDefaultRegex && input != null)
      input = input.replace(Constants.regexes.quotes, "");

    if (input == null || input === "") {
      if (cmd.args[i].optional) {
        return {
          content: newContent,
          input,
          result: {value: this.defaultValue(cmd.args[i].defaultValue, msg)}
        };
      }

      return {
        content: newContent,
        input,
        result: ArgumentResult.fromInvalidCount(cmd)
      };
    }

    const result = await cmd.args[i].typeReader.read(
      cmd,
      msg,
      cmd.args[i],
      args,
      input
    );

    return {
      content: newContent,
      input,
      result
    };
  }

  async runArgPreconditions(message, command, i, args, value) {
    for (let j = 0; j < command.args[i].preconditions.length; j++) {
      const preconditionResult = await command.args[i].preconditions[j].run(
        command,
        message,
        command.args[i],
        args,
        value,
        command.args[i].preconditionOptions[j]
      );

      if (!preconditionResult.success)
        return preconditionResult;
    }
  }

  /**
   * Attempts to parse Arguments.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @param {number} prefixLength The length of the prefix to use when handling
   * the command.
   * @returns {Promise<ArgumentResult|PreconditionResult|TypeReaderResult>} The
   * result of the argument parsing.
   */
  async parseArguments(msg, cmd, prefixLength) {
    const args = {};
    let cnt = msg.content.slice(prefixLength);
    let split = cnt.match(this.argumentRegex);

    if (split.length > 1)
      cnt = cnt.slice(cnt.indexOf(split[1], split[0].length));
    else
      cnt = "";

    split = split.slice(1);

    for (let i = 0; i < cmd.args.length; i++) {
      let val;

      if (cmd.args[i].infinite) {
        const res = await this.parseInfiniteArg(msg, cmd, i, args, split);

        if (res != null) {
          if (res.success === false)
            return res;

          val = res;
        }
      } else {
        let res = await this.parseFiniteArg(msg, cmd, i, args, cnt, split);

        val = res.result.value;
        cnt = res.content;

        if (res.result.success === false)
          return res.result;

        res = await this.runArgPreconditions(msg, cmd, i, args, val);

        if (res != null)
          return res;
      }

      args[cmd.args[i].key] = val;
    }

    return ArgumentResult.fromSuccess(cmd, args);
  }

  /**
   * Attempts to revert a Command's cooldown.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @returns {Promise} Resolves once the cooldown has been reverted.
   */
  async revertCooldown(message, command) {
    const guild = this.registry.libraryHandler.guild(message);

    await command.revertCooldown(
      message.author.id,
      guild == null ? null : guild.id
    );
  }

  /**
   * Attempts to execute a command.
   * @param {Message} message The received message.
   * @param {number} prefixLength The length of the prefix to use when handling
   * the command.
   * @returns {Promise<ArgumentResult|CooldownResult|PreconditionResult
   * |TypeReaderResult|ExceptionResult|Result>} The result of the command
   * execution.
   */
  async run(message, prefixLength) {
    let result = await this.parseCommand(message, prefixLength);

    if (!result.success)
      return result;

    const {command} = result;

    result = await this.internalRun(message, command, prefixLength);
    await this.runCommandPostconditions(message, command, result);

    if (!(result instanceof Result))
      result = Result.fromSuccess(command);

    return result;
  }

  async internalRun(message, command, prefixLength) {
    let result = await this.validateCommand(message, command);

    if (!result.success)
      return result;

    result = await this.updateCooldown(message, command);

    if (!result.success)
      return result;

    try {
      result = await this.runCommandPreconditions(message, command);

      if (!result.success) {
        await this.revertCooldown(message, command);

        return result;
      }

      result = await this.parseArguments(message, command, prefixLength);

      if (!result.success) {
        await this.revertCooldown(message, command);

        return result;
      }

      result = await command.run(message, result.args);
    } catch (err) {
      await this.revertCooldown(message, command);

      return ExceptionResult.fromError(command, err);
    }

    if (result instanceof CommandResult)
      await this.revertCooldown(message, command);

    return result;
  }

  defaultValue(defaultValue, message) {
    switch (defaultValue) {
      case ArgumentDefault.Author:
        return message.author;
      case ArgumentDefault.Message:
        return message;
      case ArgumentDefault.Member:
        return message.member;
      case ArgumentDefault.Channel:
        return message.channel;
      case ArgumentDefault.Guild:
        return message.guild;
      case ArgumentDefault.HighestRole:
        return this.registry.libraryHandler.highestRole(message);
      default:
        return defaultValue;
    }
  }

  static validateHandler(handler) {
    if (!(handler.registry instanceof Registry)) {
      throw new TypeError(
        "Handler: The registry must be an instance of the Registry class."
      );
    } else if (!(handler.argumentRegex instanceof RegExp)) {
      throw new TypeError(
        "Handler: The argument regex must be a regular expression."
      );
    }
  }
}

module.exports = Handler;
