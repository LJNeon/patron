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
const path = require("path");
const ArgumentPrecondition = require("./ArgumentPrecondition.js");
const Command = require("./Command.js");
const Group = require("./Group.js");
const Postcondition = require("./Postcondition.js");
const Precondition = require("./Precondition.js");
const TypeReader = require("./TypeReader.js");
const InvalidOptions = require("../utils/InvalidOptions.js");
const lib = require("../utils/libraryHandler.js");
const {RequireAllSync} = require("../utils/RequireAll.js");

class Registry {
  constructor(options = {}) {
    if(InvalidOptions(options, true))
      throw ReferenceError("The Registry constructor requires an options object.");

    this.caseSensitive = options.caseSensitive == null ? true : options.caseSensitive;
    this.defaultReaders = options.defaultReaders == null ? true : options.defaultReaders;
    this.argumentPreconditions = new Map();
    this.commands = new Map();
    this.groups = new Map();
    this.postconditions = new Map();
    this.preconditions = new Map();
    this.typeReaders = new Map();
    this.prefixes = new Map();
    Registry.validate(this);

    if(this.defaultReaders) {
      const readers = RequireAllSync(path.join(__dirname, "../readers"));

      this.registerTypeReaders(readers.map(reader => reader instanceof TypeReader ? reader : reader(this)));
    }
  }

  getGroupedCommands(groupName) {
    if(!this.getGroup(groupName))
      throw ReferenceError(`The '${groupName}' Group isn't registered.`);

    const commands = [];
    const added = [];

    for(const cmd of this.commands.values()) {
      if(!added.includes(cmd.names[0]) && this.equals(cmd.group, groupName)) {
        commands.push(cmd);
        added.push(cmd.names[0]);
      }
    }

    return commands;
  }

  getArgumentPrecondition(name) {
    return this.argumentPreconditions.get(this.toLowerCase(name));
  }

  getCommand(name) {
    return this.commands.get(this.toLowerCase(name));
  }

  getGroup(name) {
    return this.groups.get(this.toLowerCase(name));
  }

  getPostcondition(name) {
    return this.postconditions.get(this.toLowerCase(name));
  }

  getPrecondition(name) {
    return this.preconditions.get(this.toLowerCase(name));
  }

  getTypeReader(type) {
    return this.typeReaders.get(this.toLowerCase(type));
  }

  registerPrefixes(prefixes, guildId = "global") {
    const existing = this.prefixes.get(guildId);
    const results = existing == null ? prefixes : existing.concat(prefixes);

    this.prefixes.set(guildId, results.filter((val, i) => results.indexOf(val) === i));

    return this;
  }

  unregisterPrefixes(prefixes, guildId = "global") {
    const existing = this.prefixes.get(guildId);

    if(existing == null)
      return;

    this.prefixes.set(guildId, existing.filter(val => !prefixes.includes(val)));

    return this;
  }

  registerArgumentPreconditions(conditions) {
    if(typeof conditions === "string")
      conditions = RequireAllSync(conditions);

    if(!Array.isArray(conditions) || conditions.some(c => !(c instanceof ArgumentPrecondition)))
      throw TypeReader("Registry#registerArgumentPreconditions() only accepts an array of ArgumentPreconditions.");

    for(let i = 0; i < conditions.length; i++) {
      const name = this.toLowerCase(conditions[i].name);

      if(this.argumentPreconditions.has(name))
        throw ReferenceError(`Another ArgumentPrecondition already has the '${name}' name.`);

      this.argumentPreconditions.set(name, conditions[i]);
    }

    return this;
  }

  unregisterArgumentPreconditions(names) {
    if(!Array.isArray(names) || names.some(item => typeof item !== "string"))
      throw TypeError("Registry#unregisterArgumentPreconditions() only accepts an array of strings.");

    for(let i = 0; i < names.length; i++) {
      const name = this.toLowerCase(names[i]);

      for(const command of this.commands.values()) {
        if(command.arguments.some(a => a.preconditions.some(p => this.equals(p, names[i]))))
          throw ReferenceError(`The '${names[i]}' ArgumentPrecondition is in use and can't be unregistered.`);
      }

      const deleted = this.argumentPreconditions.delete(name);

      if(!deleted)
        throw ReferenceError(`An ArgumentPrecondition with the '${names[i]}' name hasn't been registered.`);
    }

    return this;
  }

  registerCommands(commands) {
    if(typeof commands === "string")
      commands = RequireAllSync(commands);

    if(!Array.isArray(commands) || commands.some(c => !(c instanceof Command)))
      throw TypeError("Registry#registerCommands only accepts an array of Commands.");

    for(let i = 0; i < commands.length; i++) {
      if(commands[i].names.length === 0)
        throw ReferenceError("Commands must have at least one name.");

      const names = commands[i].names.map(name => this.toLowerCase(name));
      let res;

      for(let j = 0; j < names.length; j++) {
        if(this.commands.has(names[j]))
          throw ReferenceError(`Another Command already has the '${names[j]}' name.`);
      }

      if((res = this.validateConditions(commands[i])) != null)
        throw ReferenceError(res);
      else if((res = this.validateCommand(commands[i])) != null)
        throw ReferenceError(res);

      for(let j = 0; j < names.length; j++)
        this.commands.set(names[j], commands[i]);
    }

    return this;
  }

  unregisterCommands(names) {
    if(!Array.isArray(names) || names.some(item => typeof item !== "string"))
      throw TypeError("Registry#unregisterCommands() only accepts an array of strings.");

    for(let i = 0; i < names.length; i++) {
      const command = this.getCommand(names[i]);

      if(command == null)
        throw ReferenceError(`A Command with the '${names[i]}' name hasn't been registered.`);

      const list = command.names.map(name => this.toLowerCase(name));

      for(let j = 0; j < list.length; j++)
        this.commands.delete(list[j]);

      return true;
    }

    return this;
  }

  registerGroups(groups) {
    if(typeof groups === "string")
      groups = RequireAllSync(groups);

    if(!Array.isArray(groups) || groups.some(c => !(c instanceof Group)))
      throw TypeError("Registry#registerGroups only accepts an array of Groups.");

    for(let i = 0; i < groups.length; i++) {
      const name = this.toLowerCase(groups[i].name);
      let res;

      if(this.groups.has(name))
        throw ReferenceError(`Another Group already has the '${name}' name.`);
      else if((res = this.validateConditions(groups[i])) != null)
        throw ReferenceError(res);

      this.groups.set(name, groups[i]);
    }

    return this;
  }

  unregisterGroups(names) {
    if(!Array.isArray(names) || names.some(item => typeof item !== "string"))
      throw TypeError("Registry#unregisterGroups() only accepts an array of strings.");

    for(let i = 0; i < names.length; i++) {
      const name = this.toLowerCase(names[i]);

      for(const command of this.commands.values()) {
        if(this.equals(command.group, names[i]))
          throw ReferenceError(`The ${names[i]} group is in use and can't be unregistered.`);
      }

      const deleted = this.groups.delete(name);

      if(!deleted)
        throw ReferenceError(`A Group with the '${names[i]}' name hasn't been registered.`);
    }

    return this;
  }

  registerPostconditions(conditions) {
    if(typeof conditions === "string")
      conditions = RequireAllSync(conditions);

    if(!Array.isArray(conditions) || conditions.some(c => !(c instanceof Postcondition)))
      throw TypeError("Registry#registerPostconditions only accepts an array of Postconditions.");

    for(let i = 0; i < conditions.length; i++) {
      const name = this.toLowerCase(conditions[i].name);

      if(this.postconditions.has(name))
        throw ReferenceError(`Another Postcondition already has the '${name}' name.`);

      this.postconditions.set(name, conditions[i]);
    }

    return this;
  }

  unregisterPostconditions(names) {
    if(!Array.isArray(names) || names.some(item => typeof item !== "string"))
      throw TypeError("Registry#unregisterPostconditions() only accepts an array of strings.");

    for(let i = 0; i < names.length; i++) {
      const name = this.toLowerCase(names[i]);

      for(const command of this.commands.values()) {
        if(command.postconditions.some(p => this.equals(p, names[i])))
          throw ReferenceError(`The '${names[i]}' Postcondition is in use and can't be unregistered.`);
      }

      for(const group of this.group.values()) {
        if(group.postconditions.some(p => this.equals(p, names[i])))
          throw ReferenceError(`The '${names[i]}' Postcondition is in use and can't be unregistered.`);
      }

      const deleted = this.postconditions.delete(name);

      if(!deleted)
        throw ReferenceError(`A Postcondition with the '${names[i]}' name hasn't been registered.`);
    }

    return this;
  }

  registerPreconditions(conditions) {
    if(typeof conditions === "string")
      conditions = RequireAllSync(conditions);

    if(!Array.isArray(conditions) || conditions.some(c => !(c instanceof Precondition)))
      throw TypeError("Registry#registerPreconditions only accepts an array of Preconditions.");

    for(let i = 0; i < conditions.length; i++) {
      const name = this.toLowerCase(conditions[i].name);

      if(this.preconditions.has(name))
        throw ReferenceError(`Another Precondition already has the '${name}' name.`);

      this.preconditions.set(name, conditions[i]);
    }

    return this;
  }

  unregisterPreconditions(names) {
    if(!Array.isArray(names) || names.some(item => typeof item !== "string"))
      throw TypeError("Registry#unregisterPreconditions() only accepts an array of strings.");

    for(let i = 0; i < names.length; i++) {
      const name = this.toLowerCase(names[i]);

      for(const command of this.commands.values()) {
        if(command.preconditions.some(p => this.equals(p, names[i])))
          throw ReferenceError(`The '${names[i]}' Precondition is in use and can't be unregistered.`);
      }

      for(const group of this.group.values()) {
        if(group.preconditions.some(p => this.equals(p, names[i])))
          throw ReferenceError(`The '${names[i]}' Precondition is in use and can't be unregistered.`);
      }

      const deleted = this.preconditions.delete(name);

      if(!deleted)
        throw ReferenceError(`A Precondition with the '${names[i]}' name hasn't been registered.`);
    }

    return this;
  }

  registerTypeReaders(readers) {
    if(typeof readers === "string")
      readers = RequireAllSync(readers);

    if(!Array.isArray(readers) || readers.some(r => !(r instanceof TypeReader)))
      throw TypeError("Registry#registerTypeReaders() only accepts an array of TypeReaders.");

    for(let i = 0; i < readers.length; i++) {
      const type = this.toLowerCase(readers[i].type);
      const existing = this.typeReaders.get(type);

      if(existing == null || existing.default)
        this.typeReaders.set(type, readers[i]);
      else
        throw ReferenceError(`Another TypeReader already has the '${type}' type.`);
    }

    return this;
  }

  unregisterTypeReaders(types) {
    if(!Array.isArray(types) || types.some(item => typeof item !== "string"))
      throw TypeError("Registry#unregisterTypeReaders() only accepts an array of strings.");

    for(let i = 0; i < types.length; i++) {
      const type = this.toLowerCase(types[i]);

      for(const command of this.commands.values()) {
        if(command.arguments.some(a => this.equals(a.type, types[i])))
          throw ReferenceError(`The '${types[i]}' TypeReader is in use and can't be unregistered.`);
      }

      const deleted = this.typeReaders.delete(type);

      if(!deleted)
        throw ReferenceError(`A TypeReader with the '${types[i]}' type hasn't been registered.`);
    }

    return this;
  }

  validateConditions(obj) {
    if(obj.preconditionOptions.length > obj.preconditions.length)
      return "Too many Precondition options were provided.";
    else if(obj.postconditionOptions.length > obj.postconditions.length)
      return "Too many Postcondition options were provided.";

    for(let i = 0; i < obj.preconditions.length; i++) {
      if(!this.getPrecondition(obj.preconditions[i]))
        return `The '${obj.preconditions[i]}' Precondition isn't registered.`;
    }

    for(let i = 0; i < obj.postconditions.length; i++) {
      if(!this.getPostcondition(obj.postconditions[i]))
        return `The '${obj.postconditions[i]}' Postcondition isn't registered.`;
    }
  }

  validateCommand(command) {
    let perm;

    if(command.group != null && !this.getGroup(command.group))
      return `The '${command.group}' Group isn't registered.`;
    else if(command.clientPermissions.some(p => !lib.isPerm(p) && (perm = p))
        || command.memberPermissions.some(p => !lib.isPerm(p) && (perm = p)))
      return `The '${perm}' permission doesn't exist.`;

    for(let i = 0; i < command.arguments.length; i++) {
      const arg = command.arguments[i];

      if(!this.getTypeReader(arg.type))
        return `The '${arg.type}' TypeReader isn't registered.`;
      else if(arg.infinite && arg.remainder)
        return "An Argument may not be both infinite and a remainder.";
      else if((arg.infinite || arg.remainder) && i !== command.arguments.length - 1)
        return "Only the last Argument may be infinite or a remainder.";
      else if(arg.preconditionOptions.length > arg.preconditions.length)
        return "Too many ArgumentPrecondition options provided.";

      for(let j = 0; j < arg.preconditions.length; j++) {
        if(!this.getArgumentPrecondition(arg.preconditions[j]))
          return `The '${arg.preconditions[j]}' ArgumentPrecondition isn't registered.`;
      }

      for(let j = i + 1; j < command.arguments.length; j++) {
        if(command.arguments[j].key === arg.key)
          return `The '${arg.key}' Argument key is already taken.`;
      }
    }
  }

  equals(cero, uno) {
    if(this.caseSensitive)
      return cero === uno;

    return cero.toLowerCase() === uno.toLowerCase();
  }

  toLowerCase(string) {
    if(this.caseSensitive)
      return string;

    return string.toLowerCase();
  }

  static validate(registry) {
    if(typeof registry.caseSensitive !== "boolean")
      throw TypeError("Registry#caseSensitive must be a boolean.");
    else if(typeof registry.defaultReaders !== "boolean")
      throw TypeError("Registry#defaultReaders must be a boolean.");
  }
}

module.exports = Registry;
