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
const Argument = require("./Argument.js");
const Context = require("../enums/Context.js");
const Cooldown = require("./Cooldown.js");

/**
 * A command.
 * @prop {Argument[]} args The command's arguments.
 * @prop {string[]} botPermissions The permissions required by the bot to
 * execute the command.
 * @prop {?Cooldown} cooldowns An object of all user cooldowns and cooldown
 * options on the command.
 * @prop {string} description The command's description.
 * @prop {Group} group The command's group.
 * @prop {boolean} hasCooldown Whether or not the command has a cooldown.
 * @prop {string[]} memberPermissions The permissions required by the invoker
 * to use the command.
 * @prop {string[]} names The command's names.
 * @prop {Array<*>} preconditionOptions The options to be passed to
 * preconditions when they're run.
 * @prop {Precondition[]} preconditions The preconditions to be ran on the
 * command.
 * @prop {Array<*>} postconditionOptions The options to be passed to
 * postconditions when they're run.
 * @prop {Postcondition[]} postconditions The postconditions to be ran on the
 * command.
 * @prop {Symbol[]} usableContexts An array of contexts the command can be used
 * in.
 */
class Command {
  /**
   * @typedef {object} CommandOptions The command options.
   * @prop {Argument[]} [args=[]] The command's arguments.
   * @prop {string[]} [botPermissions=[]] The permissions required by the bot
   * to execute the command.
   * @prop {number|object} [cooldown] The length of the cooldown in
   * milliseconds or an object. See Cooldown class documentation for details on
   * the object's structure.
   * @prop {string} [description=""] The command's description.
   * @prop {string} groupName The name of the command's group.
   * @prop {string[]} [memberPermissions=[]] The permissions required by the
   * invoker to use the command.
   * @prop {string[]} names The command's names.
   * @prop {Array<*>} [preconditionOptions=[]] The options to be passed to
   * preconditions when they're run.
   * @prop {string[]} [preconditions=[]] The preconditions to be ran on the
   * command.
   * @prop {Array<*>} [postconditionOptions=[]] The options to be passed to
   * postconditions when they're run.
   * @prop {string[]} [postconditions=[]] The postconditions to be ran on the
   * command.
   * @prop {Symbol[]} [usableContexts=[Context.Guild]] An array of contexts the
   * command can be used in.
   */

  /**
   * @param {CommandOptions} options The command options.
   */
  constructor(options) {
    this.args = options.args == null ? [] : options.args;

    if (options.botPermissions == null)
      this.botPermissions = [];
    else
      this.botPermissions = options.botPermissions;

    this.hasCooldown = options.cooldown != null;

    if (this.hasCooldown)
      this.cooldowns = new Cooldown(options.cooldown);

    this.description = options.description == null ? "" : options.description;
    this.groupName = options.groupName;

    if (options.memberPermissions == null)
      this.memberPermissions = [];
    else
      this.memberPermissions = options.memberPermissions;

    this.names = options.names;

    if (options.preconditionOptions == null)
      this.preconditionOptions = [];
    else
      this.preconditionOptions = options.preconditionOptions;

    if (options.preconditions == null)
      this.preconditions = [];
    else
      this.preconditions = options.preconditions;

    if (options.postconditionOptions == null)
      this.postconditionOptions = [];
    else
      this.postconditionOptions = options.postconditionOptions;

    if (options.postconditions == null)
      this.postconditions = [];
    else
      this.postconditions = options.postconditions;

    if (options.usableContexts == null)
      this.usableContexts = [Context.Guild];
    else
      this.usableContexts = options.usableContexts;

    this.constructor.validateCommand(this);
  }

  /**
   * Executes the command.
   * @param {Message} message The received message.
   * @param {object} args The arguments of the command.
   * @abstract
   * @returns {Promise<*>} Resolves once the execution of the
   * command is complete.
   */
  async run() {
    throw new ReferenceError(`${this.constructor.name} has no run method.`);
  }

  /**
   * Returns a usage string of the command.
   * @returns {string} The usage of the command.
   */
  getUsage() {
    if (this.usage != null)
      return this.usage;

    [this.usage] = this.names;

    for (let i = 0; i < this.args.length; i++) {
      let before = "<";
      let after = ">";

      if (this.args[i].optional) {
        before = "[";
        after = "]";
      }

      const {type} = this.args[i].typeReader;

      if (type.toLowerCase().includes("role")
          || type.toLowerCase().includes("member")
          || type.toLowerCase().includes("user"))
        before += "@";
      else if (type.toLowerCase().includes("channel"))
        before += "#";

      this.usage += ` ${before}${this.args[i].name}${after}`;
    }

    return this.usage;
  }

  /**
   * Returns an example string of the command.
   * @returns {string} An example of usage of the command.
   */
  getExample() {
    if (this.example != null)
      return this.example;

    [this.example] = this.names;

    for (let i = 0; i < this.args.length; i++)
      this.example += ` ${this.args[i].example}`;

    return this.example;
  }

  /**
   * Attempts to update the Command's cooldown.
   * @param {string} userId The user ID.
   * @param {string} [guildId] The guild ID.
   * @returns {Promise<boolean>} Whether or not the user is on cooldown.
   */
  async updateCooldown(userId, guildId) {
    if (!this.hasCooldown)
      return false;

    return this.cooldowns.use(userId, guildId);
  }

  /**
   * Attempts to revert the Command"s cooldown.
   * @param {string} userId The user ID.
   * @param {string} [guildId] The guild ID.
   * @returns {Promise} Resolves once the cooldown is reverted.
   */
  async revertCooldown(userId, guildId) {
    if (this.hasCooldown)
      return this.cooldowns.revert(userId, guildId);
  }

  static validateCommand(command) {
    const name = `${command.constructor.name}:`;

    if (!Array.isArray(command.args)
        || command.args.some(arg => !(arg instanceof Argument))) {
      throw new TypeError(
        `${name} The args must be an array of instances of the Argument class.`
      );
    } else if (!Array.isArray(command.botPermissions)
        || command.botPermissions.some(perm => typeof perm !== "string")) {
      throw new TypeError(
        `${name} The bot permissions must be an array of strings.`
      );
    } else if (typeof command.description !== "string") {
      throw new TypeError(`${name} The description must be a string.`);
    } else if (typeof command.groupName !== "string") {
      throw new TypeError(`${name} The group name must be a string.`);
    } else if (!Array.isArray(command.memberPermissions)
        || command.memberPermissions.some(perm => typeof perm !== "string")) {
      throw new TypeError(
        `${name} The member permissions must be an array of strings.`
      );
    } else if (!Array.isArray(command.names)
        || command.names.some(n => typeof n !== "string")) {
      throw new TypeError(`${name} The names must be an array of strings.`);
    } else if (!Array.isArray(command.postconditionOptions)) {
      throw new TypeError(
        `${name} The postcondition options must be an array.`
      );
    } else if (!Array.isArray(command.postconditions)
        || command.postconditions.some(pcnd => typeof pcnd !== "string")) {
      throw new TypeError(
        `${name} The postconditions must be an array of strings.`
      );
    } else if (!Array.isArray(command.preconditionOptions)) {
      throw new TypeError(
        `${name} The precondition options must be an array.`
      );
    } else if (!Array.isArray(command.preconditions)
        || command.preconditions.some(pcnd => typeof pcnd !== "string")) {
      throw new TypeError(
        `${name} The preconditions must be an array of strings.`
      );
    } else if (!Array.isArray(command.usableContexts)
        || command.usableContexts.some(ctxt => typeof ctxt !== "symbol")) {
      throw new TypeError(
        `${name} The usable contexts must be an array of symbols.`
      );
    }
  }
}

module.exports = Command;
