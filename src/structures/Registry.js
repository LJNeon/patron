const discord = require('discord.js');
const path = require('path');
const requireAll = require('require-all');
const Command = require('./Command.js');
const Group = require('./Group.js');
const TypeReader = require('./TypeReader.js');

class Registry {
  constructor() {
    this.commands = new discord.Collection();
    this.groups = new discord.Collection();
    this.typeReaders = new discord.Collection();
  }

  registerDefaultTypeReaders() {
    return this.registerTypeReadersIn(path.join(__dirname, '/../readers'));
  }

  registerTypeReadersIn(path) {
    const obj = requireAll(path);
    const typeReaders = [];

    for (const typeReader of Object.values(obj)) {
      typeReaders.push(typeReader);
    }

    return this.registerTypeReaders(typeReaders);
  }

  registerTypeReaders(typeReaders) {
    if (!Array.isArray(typeReaders)) {
      throw new TypeError('TypeReaders must be an array.');
    }

    for (const typeReader of typeReaders) {
      if (typeof typeReader !== 'object') {
        throw new TypeError('All type reader exports must be an instance of the type reader.');
      } else if (!(typeReader instanceof TypeReader)) {
        throw new Error('All type readers must be inherit the TypeReader class.');
      } else if (this.typeReaders.has(typeReader.type)) {
        throw new Error('The ' + typeReader.type + ' type reader already exists.');
      }

      this.typeReaders.set(typeReader.type, typeReader);
    }

    return this;
  }

  registerGroupsIn(path) {
    const obj = requireAll(path);
    const groups = [];

    for (const group of Object.values(obj)) {
      groups.push(group);
    }

    return this.registerGroups(groups);
  }

  registerGroups(groups) {
    if (!Array.isArray(groups)) {
      throw new TypeError('Groups must be an array.');
    }

    for (const group of groups) {
      if (typeof group !== 'object') {
        throw new TypeError('All group exports must be an instance of the group.');
      } else if (!(group instanceof Group)) {
        throw new Error('All groups must inherit the Group class.');
      } else if (this.groups.has(group.name)) {
        throw new Error('The ' + group.name + ' group already exists.');
      }

      this.groups.set(group.name, group);
    }

    return this;
  }

  registerCommandsIn(path) {
    const obj = requireAll(path);
    const commands = [];

    for (const group of Object.values(obj)) {
      for (const command of Object.values(group)) {
        commands.push(command);
      }
    }

    return this.registerCommands(commands);
  }

  registerCommands(commands) {
    if (!Array.isArray(commands)) {
      throw new TypeError('Commands must be an array.');
    }

    for (const command of commands) {
      if (typeof command !== 'object') {
        throw new TypeError('All command exports must be an instance of the command.');
      } else if (!(command instanceof Command)) {
        throw new Error('All commands must inherit the Command class.');
      } else if (!this.groups.has(command.group)) {
        throw new Error('The group ' + command.group + ' is not registered.');
      }

      for (const alias of command.aliases.concat([command.name])) {
        if (this.commands.has(alias) || this.commands.filterArray((value) => value.aliases.some((v) => v === alias)).length > 0) {
          throw new Error('A command with the name ' + alias + ' is already registered.');
        }
      }

      const group = this.groups.get(command.group);

      command.group = group;
      group.commands.set(command.name, command);
      this.commands.set(command.name, command);
    }

    return this;
  }
}

module.exports = Registry;
