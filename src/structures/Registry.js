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
const path = require("path");
const ArgumentPrecondition = require("./ArgumentPrecondition.js");
const Command = require("./Command.js");
const Group = require("./Group.js");
const Library = require("../enums/Library.js");
const LibraryHandler = require("../utility/LibraryHandler.js");
const Postcondition = require("./Postcondition.js");
const Precondition = require("./Precondition.js");
const RequireAll = require("../utility/RequireAll.js");
const TypeReader = require("./TypeReader.js");
const TypeReaderCategory = require("../enums/TypeReaderCategory.js");

/**
 * A registry containing all commands, groups, preconditions, and type readers.
 * @prop {ArgumentPrecondtion[]} argumentPreconditions All registered argument
 * preconditions.
 * @prop {Command[]} commands All registered commands.
 * @prop {Group[]} groups All registered groups.
 * @prop {Library} library The library being used.
 * @prop {Postcondition[]} postconditions All registered postconditions.
 * @prop {Precondition[]} preconditions All registered preconditions.
 * @prop {TypeReader[]} typeReaders All registered type readers.
 */
class Registry {
  /**
   * @typedef {object} RegistryOptions The registry options.
   * @prop {boolean} [caseSensitive=true] Whether or not patron treats strings
   * as case-sensitive.
   * @prop {Library} library The library of the registry.
   */

  /**
   * @param {RegistryOptions} options The registry options.
   */
  constructor(options) {
    this.argumentPreconditions = [];

    if (options.caseSensitive == null)
      this.caseSensitive = true;
    else
      this.caseSensitive = options.caseSensitive;

    this.commands = [];
    this.groups = [];
    this.library = options.library;
    this.libraryHandler = new LibraryHandler({library: this.library});
    this.postconditions = [];
    this.preconditions = [];
    this.typeReaders = [];
    this.constructor.validateRegistry(this);
    RequireAll(path.join(__dirname, "/../extensions", this.library));
  }

  /**
   * Registers an array of argument preconditions.
   * @param {ArgumentPrecondition[]} argumentPreconditions An array of argument
   * preconditions to be registered.
   * @returns {Registry} The registry being used.
   */
  registerArgumentPreconditions(argPreconditions) {
    if (!Array.isArray(argPreconditions)
        || argPreconditions.some(p => !(p instanceof ArgumentPrecondition))) {
      throw new TypeError(
        "The argument preconditions must be an array of ArgumentPrecondition \
        class instances."
      );
    }

    for (let i = 0; i < argPreconditions.length; i++) {
      const {name} = argPreconditions[i];

      if (this.argumentPreconditions.some(p => this.equals(p.name, name))) {
        throw new Error(
          `The ${name} argument preconditon already exists.`
        );
      }

      this.argumentPreconditions.push(argPreconditions[i]);
    }

    return this;
  }

  /**
   * Registers an array of commands.
   * @param {Command[]} commands An array of commands to register.
   * @returns {Registry} The registry being used.
   */
  registerCommands(commands) {
    if (!Array.isArray(commands)
        || commands.some(cmd => !(cmd instanceof Command))) {
      throw new TypeError(
        "The commands must be an array of Command class instances."
      );
    }

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];

      if (cmd.names.length === 0)
        throw new Error("All commands must have at least one name.");

      for (let j = 0; j < cmd.names.length; j++) {
        const name = cmd.names[j];

        if (this.commands.some(c => c.names.some(n => this.equals(n, name))))
          throw new Error(`The ${name} command is already registered.`);
      }

      this.validateCommandArgs(commands, i);
      this.validateCommandPostconditions(commands, i);
      this.validateCommandPreconditions(commands, i);

      const group = this.groups.find(
        grp => this.equals(grp.name, cmd.groupName)
      );

      if (group == null) {
        throw new Error(
          `${cmd.names[0]}: The ${cmd.groupName} group is not registered.`
        );
      }

      delete cmd.groupName;
      cmd.group = group;
      group.commands.push(cmd);
      this.commands.push(cmd);
    }

    return this;
  }

  /**
   * Registers all global type readers.
   * @returns {Promise<Registry>} The registry being used.
   */
  async registerGlobalTypeReaders() {
    return this.registerTypeReaders(await RequireAll(
      path.join(__dirname, "/../readers/global")
    ));
  }

  /**
   * Registers an array of groups.
   * @param {Group[]} groups An array of groups to be registered.
   * @returns {Registry} The registry being used.
   */
  registerGroups(groups) {
    if (!Array.isArray(groups)
        || groups.some(grp => !(grp instanceof Group))) {
      throw new TypeError(
        "The groups must be an array of Group class instances."
      );
    }

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];

      if (this.groups.some(grp => this.equals(grp.name, group.name)))
        throw new Error(`The ${group.name} group already exists.`);

      for (let j = 0; j < group.preconditions.length; j++) {
        const precondition = this.preconditions.find(
          p => this.equals(p.name, group.preconditions[j])
        );

        if (precondition == null) {
          throw new Error(
            `${group.name}: The ${group.preconditions[j]} precondition is not \
            registered.`
          );
        }

        group.preconditions[j] = precondition;
      }

      for (let j = 0; j < group.postconditions.length; j++) {
        const postcondition = this.postconditions.find(
          p => this.equals(p.name, group.postconditions[j])
        );

        if (postcondition == null) {
          throw new Error(
            `${group.name}: The ${group.postconditions[j]}postcondition is \
            not registered.`
          );
        }

        group.postconditions[j] = postcondition;
      }

      this.groups.push(groups[i]);
    }

    return this;
  }

  /**
   * Registers all library type readers.
   * @returns {Promise<Registry>} The registry being used.
   */
  async registerLibraryTypeReaders() {
    return this.registerTypeReaders(await RequireAll(
      path.join(__dirname, "/../readers", this.library)
    ));
  }

  /**
   * Registers an array of postconditions.
   * @param {Postcondition[]} postconditions An array of postconditions to be
   * registered.
   * @returns {Registry} The registry being used.
   */
  registerPostconditions(postconditions) {
    if (!Array.isArray(postconditions)
        || postconditions.some(pcnd => !(pcnd instanceof Postcondition))) {
      throw new TypeError(
        "The postconditions must be an array of Postcondition class instances."
      );
    }

    for (let i = 0; i < postconditions.length; i++) {
      const pcnd = postconditions[i];

      if (this.postconditions.some(p => this.equals(p.name, pcnd.name)))
        throw new Error(`The ${pcnd.name} postcondition already exists.`);

      this.postconditions.push(pcnd);
    }

    return this;
  }

  /**
   * Registers an array of preconditions.
   * @param {Precondition[]} preconditions An array of preconditions to be
   * registered.
   * @returns {Registry} The registry being used.
   */
  registerPreconditions(preconditions) {
    if (!Array.isArray(preconditions)
        || preconditions.some(pcnd => !(pcnd instanceof Precondition))) {
      throw new TypeError(
        "The preconditions must be an array of Precondition class instances."
      );
    }

    for (let i = 0; i < preconditions.length; i++) {
      const pcnd = preconditions[i];

      if (this.preconditions.some(p => this.equals(p.name, pcnd.name)))
        throw new Error(`The ${pcnd.name} preconditon already exists.`);

      this.preconditions.push(pcnd);
    }

    return this;
  }

  /**
   * Registers an array of type readers.
   * @param {TypeReader[]} typeReaders An array of type readers to register.
   * @returns {Registry} The registry being used.
   */
  registerTypeReaders(typeReaders) {
    if (!Array.isArray(typeReaders)
        || typeReaders.some(trdr => !(trdr instanceof TypeReader))) {
      throw new TypeError(
        "The type readers must be an array of TypeReader class instances."
      );
    }

    for (let i = 0; i < typeReaders.length; i++) {
      const trdr = typeReaders[i];

      if (this.typeReaders.some(t => this.equals(t.type, trdr.type)))
        throw new Error(`The ${trdr.type} type reader already exists.`);

      this.typeReaders.push(trdr);
    }

    return this;
  }

  /**
   * Unregisters an array of argument preconditions.
   * @param {string[]} argumentPreconditions An array of argument
   * precondition names to be unregistered.
   * @returns {Registry} The registry being used.
   */
  unregisterArgumentPreconditions(argumentPreconditions) {
    if (!Array.isArray(argumentPreconditions)
        || argumentPreconditions.some(pcnd => typeof pcnd !== "string")) {
      throw new TypeError(
        "The argument preconditions must be an array of strings."
      );
    }

    for (let i = 0; i < argumentPreconditions.length; i++) {
      const name = argumentPreconditions[i];

      if (this.argumentPreconditions.every(p => this.equals(p.name, name))) {
        throw new Error(
          `The ${name} argument precondition is already not registered.`
        );
      }

      for (let j = 0; j < this.commands.length; j++) {
        const command = this.commands[j];

        for (let k = 0; k < command.args.length; k++) {
          const arg = command.args[i];

          if (arg.preconditions.some(pcnd => this.equals(pcnd.name, name))) {
            throw new Error(
              `The ${name} argument precondition is registered to a argument.`
            );
          }
        }
      }

      this.argumentPreconditions.splice(
        this.argumentPreconditions.findIndex(p => this.equals(p.name, name)),
        1
      );
    }

    return this;
  }

  /**
   * Unregisters all global type readers.
   * @returns {Registry} The registry being used.
   */
  unregisterGlobalTypeReaders() {
    return this.unregisterTypeReaders(
      this.typeReaders.filter(t => t.category === TypeReaderCategory.Global)
    );
  }

  /**
   * Unregisters an array of groups.
   * @param {string[]} groups An array of group names to be unregistered.
   * @returns {Registry} The registry being used.
   */
  unregisterGroups(groups) {
    if (!Array.isArray(groups) || groups.some(g => typeof g !== "string"))
      throw new TypeError("The groups must be an array of strings.");

    for (let i = 0; i < groups.length; i++) {
      if (!this.groups.every(grp => this.equals(grp.name, groups[i].name))) {
        throw new Error(
          `The ${groups[i].name} group is already not registered.`
        );
      } else if (groups[i].commands.length > 0) {
        throw new Error(
          `The ${groups[i].name} group has commands registered to it.`
        );
      }

      this.groups.splice(
        this.groups.findIndex(grp => this.equals(grp.name, groups[i].name)),
        1
      );
    }

    return this;
  }

  /**
   * Unregisters all library type readers.
   * @returns {Registry} The registry being used.
   */
  unregisterLibraryTypeReaders() {
    return this.unregisterTypeReaders(
      this.typeReaders.filter(t => t.category === TypeReaderCategory.Library)
    );
  }

  /**
   * Unregisters an array of postconditions.
   * @param {string[]} postconditions An array of postcondition names to be
   * unregistered.
   * @returns {Registry} The registry being used.
   */
  unregisterPostconditions(postconditions) {
    if (!Array.isArray(postconditions)
        || postconditions.some(pcnd => typeof pcnd !== "string"))
      throw new TypeError("The postconditions must be an array of strings.");

    for (let i = 0; i < postconditions.length; i++) {
      const name = postconditions[i];

      if (!this.postconditions.every(p => this.equals(p.name, name))) {
        throw new Error(
          `The ${name} postcondition is already not registered.`
        );
      }

      for (let j = 0; j < this.commands.length; j++) {
        const cmd = this.commands[j];

        if (cmd.postconditions.some(pcnd => this.equals(pcnd.name, name))) {
          throw new Error(
            `The ${name} postcondition is registered to a command.`
          );
        }
      }

      for (let j = 0; j < this.groups.length; j++) {
        const group = this.groups[j];

        if (group.postconditions.some(pcnd => this.equals(pcnd.name, name))) {
          throw new Error(
            `The ${name} postcondition is registered to a group.`
          );
        }
      }

      this.postconditions.splice(
        this.postconditions.findIndex(p => this.equals(p.name, name)),
        1
      );
    }

    return this;
  }

  /**
   * Unregisters an array of preconditions.
   * @param {string[]} preconditions An array of precondition names to be
   * unregistered.
   * @returns {Registry} The registry being used.
   */
  unregisterPreconditions(preconditions) {
    if (!Array.isArray(preconditions)
        || preconditions.some(pcnd => typeof pcnd !== "string"))
      throw new TypeError("The preconditions must be an array of strings.");

    for (let i = 0; i < preconditions.length; i++) {
      const pcnd = preconditions[i];

      if (!this.preconditions.some(p => this.equals(p.name, pcnd))) {
        throw new Error(
          `The ${pcnd} precondition is already not registered.`
        );
      }

      for (let j = 0; j < this.commands.length; j++) {
        const {preconditions: pcnds} = this.commands[j];

        if (pcnds.some(p => this.equals(p.name, pcnd))) {
          throw new Error(
            `The ${pcnd} precondition is registered to a command.`
          );
        }
      }

      for (let j = 0; j < this.groups.length; j++) {
        const group = this.groups[j];

        if (group.preconditions.some(p => this.equals(p.name, pcnd))) {
          throw new Error(
            `The ${pcnd} precondition is registered to a group.`
          );
        }
      }

      this.preconditions.splice(this.preconditions.findIndex(
        p => this.equals(p.name, pcnd)
      ), 1);
    }

    return this;
  }

  /**
   * Unregisters an array of type readers.
   * @param {string[]} typeReaders An array of type reader names to
   * unregister.
   * @returns {Registry} The registry being used.
   */
  unregisterTypeReaders(typeReaders) {
    if (!Array.isArray(typeReaders)
        || typeReaders.some(trdr => typeof trdr !== "string"))
      throw new TypeError("The type readers must be an array of strings.");

    for (let i = 0; i < typeReaders.length; i++) {
      const type = typeReaders[i];

      if (!this.typeReaders.every(t => this.equals(t.type, type)))
        throw new Error(`The ${type} type reader is already not registered.`);

      for (let j = 0; j < this.commands.length; j++) {
        const command = this.commands[j];

        if (command.args.some(arg => this.equals(arg.typeReader.type, type))) {
          throw new Error(
            `The ${type} type reader is registered to an argument.`
          );
        }
      }

      this.typeReaders.splice(
        this.typeReaders.findIndex(t => this.equals(t.type, type)),
        1
      );
    }

    return this;
  }

  /**
   * Unregisters an array of commands.
   * @param {string[]} commands An array of command names to unregister.
   * @returns {Registry} The registry being used.
   */
  unregisterCommands(commands) {
    if (!Array.isArray(commands) || commands.some(c => typeof c !== "string"))
      throw new TypeError("The commands must be an array of strings.");

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];

      if (this.commands.every(c => c.names.every(n => !this.equals(n, cmd))))
        throw new Error(`The ${cmd} command is already not registered.`);

      this.commands.splice(
        this.commands.findIndex(c => c.names.some(n => this.equals(n, cmd))),
        1
      );

      const {group} = cmd;

      group.commands.splice(
        group.commands.findIndex(c => c.names.some(n => this.equals(n, cmd))),
        1
      );
    }

    return this;
  }

  equals(zero, one) {
    if (this.caseSensitive)
      return zero === one;

    return zero.toLowerCase() === one.toLowerCase();
  }

  validateCommandArgs(commands, i) {
    const cmd = commands[i];

    for (let j = 0; j < cmd.args.length; j++) {
      const typeReader = this.typeReaders.find(
        t => this.equals(t.type, cmd.args[j].type)
      );

      if (typeReader == null) {
        throw new Error(
          `${cmd.names[0]}: The ${cmd.args[j].type} type is not registered.`
        );
      }

      delete cmd.args[j].type;
      cmd.args[j].typeReader = typeReader;

      for (let h = 0; h < cmd.args[j].preconditions.length; h++) {
        const name = cmd.args[j].preconditions[h];
        const precondition = this.argumentPreconditions.find(
          pcnd => this.equals(pcnd.name, name)
        );

        if (precondition == null) {
          throw new Error(
            `${cmd.names[0]}: The ${name} argument precondition is \
            not registered.`
          );
        }

        cmd.args[j].preconditions[h] = precondition;
      }
    }
  }

  validateCommandPostconditions(commands, i) {
    const cmd = commands[i];

    for (let j = 0; j < cmd.postconditions.length; j++) {
      const name = cmd.postconditions[j];
      const postcondition = this.postconditions.find(
        pcnd => this.equals(pcnd.name, name)
      );

      if (postcondition == null) {
        throw new Error(
          `${cmd.names[0]}: The ${name} postcondition is not registered.`
        );
      }

      cmd.postconditions[j] = postcondition;
    }
  }

  validateCommandPreconditions(commands, i) {
    const cmd = commands[i];

    for (let j = 0; j < cmd.preconditions.length; j++) {
      const name = cmd.preconditions[j];
      const precondition = this.preconditions.find(
        pcnd => this.equals(pcnd.name, name)
      );

      if (precondition == null) {
        throw new Error(
          `${cmd.names[0]}: The ${name} precondition is not registered.`
        );
      }

      cmd.preconditions[j] = precondition;
    }
  }

  static validateRegistry(registry) {
    if (typeof registry.caseSensitive !== "boolean") {
      throw new TypeError("Registry: The case sensitivity must be a bool.");
    } else if (typeof registry.library !== "string") {
      throw new TypeError("Registry: The library must be a string.");
    } else if (!Object.values(Library).includes(registry.library)) {
      throw new Error(
        `Registry: ${registry.library} isn't a supported library.`
      );
    }
  }
}

module.exports = Registry;
