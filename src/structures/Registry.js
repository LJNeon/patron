const path = require('path');
const requireAll = require('require-all');
const Command = require('./Command.js');
const Group = require('./Group.js');
const TypeReader = require('./TypeReader.js');
const Constants = require('../utility/Constants.js');
const LibraryHandler = require('../utility/LibraryHandler.js');

/**
 * A registry containing all commands, groups and type readers.
 * @prop {Command[]} commands All registered commands.
 * @prop {Group[]} groups All registered groups.
 * @prop {TypeReader[]} typeReaders All registered type readers.
 * @prop {string} library The library being used.
 */
class Registry {
  /**
   * @typedef {object} RegistryOptions The registry options.
   * @prop {string} library The library of the registry.
   */

  /**
   * @param {RegistryOptions?} options The registry options.
   */
  constructor(options) {
    this.commands = [];
    this.groups = [];
    this.typeReaders = [];
    this.library = options !== undefined && options.library !== undefined ? options.library : 'discord.js';
    this.libraryHandler = new LibraryHandler(this.library);

    this.constructor.validateRegistry(this);
    requireAll(path.join(__dirname, '/extensions/' + this.library));
  }

  /**
   * Registers all default type readers.
   * @returns {Registry} The registry being used.
   */
  registerDefaultTypeReaders() {
    this.registerTypeReadersIn(path.join(__dirname, '/../readers/' + this.library));
    return this.registerTypeReadersIn(path.join(__dirname, '/../readers/global'));
  }

  /**
   * Registers all type readers in a specific directory.
   * @param {string} directory The directory containing the type readers to be registered.
   * @returns {Registry} The registry being used.
   */
  registerTypeReadersIn(directory) {
    const obj = requireAll(directory);
    const typeReaders = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key) === true) {
        typeReaders.push(obj[key]);
      }
    }

    return this.registerTypeReaders(typeReaders);
  }

  /**
   * Registers an array of type readers.
   * @param {TypeReader[]} typeReaders An array of type readers to register.
   * @returns {Registry} The registry being used.
   */
  registerTypeReaders(typeReaders) {
    if (Array.isArray(typeReaders) === false) {
      throw new TypeError('TypeReaders must be an array.');
    }

    for (let i = 0; i < typeReaders.length; i++) {
      if (typeof typeReaders[i] !== 'object') {
        throw new TypeError('All type reader exports must be an instance of the type reader.');
      } else if ((typeReaders[i] instanceof TypeReader) === false) {
        throw new Error('All type readers must be inherit the TypeReader class.');
      } else if (this.typeReaders.some((v) => v.type === typeReaders[i].type)) {
        throw new Error('The ' + typeReaders[i].type + ' type reader already exists.');
      }

      this.typeReaders.push(typeReaders[i]);
    }

    return this;
  }

  /**
   * Registers all groups in a specific directory.
   * @param {string} directory The directory containing the groups to be registered.
   * @returns {Registry} The registry being used.
   */
  registerGroupsIn(directory) {
    const obj = requireAll(directory);
    const groups = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key) === true) {
        groups.push(obj[key]);
      }
    }

    return this.registerGroups(groups);
  }

  /**
   * Registers an array of groups.
   * @param {Group[]} groups An array of groups to be registered.
   * @returns {Registry} The registry being used.
   */
  registerGroups(groups) {
    if (Array.isArray(groups) === false) {
      throw new TypeError('Groups must be an array.');
    }

    for (let i = 0; i < groups.length; i ++) {
      if (typeof groups[i] !== 'object') {
        throw new TypeError('All group exports must be an instance of the group.');
      } else if ((groups[i] instanceof Group) === false) {
        throw new Error('All groups must inherit the Group class.');
      } else if (this.groups.some((v) => v.name === groups[i].name) === true) {
        throw new Error('The ' + groups[i].name + ' group already exists.');
      }

      this.groups.push(groups[i]);
    }

    return this;
  }

  /**
   * Registers all commands in a specific directory.
   * @param {string} directory The directory containing the commands to be registered.
   * @returns {Registry} The registry being used.
   */
  registerCommandsIn(directory) {
    const obj = requireAll(directory);
    const commands = [];

    for (const groupKey in obj) {
      if (obj.hasOwnProperty(groupKey) === true) {
        for (const commandKey in obj[groupKey]) {
          if (obj[groupKey].hasOwnProperty(commandKey) === true) {
            commands.push(obj[groupKey][commandKey]);
          }
        }
      }
    }

    return this.registerCommands(commands);
  }

  /**
   * Registers an array of commands.
   * @param {Command[]} commands An array of commands to register.
   * @returns {Registry} The registry being used.
   */
  registerCommands(commands) {
    if (Array.isArray(commands) === false) {
      throw new TypeError('Commands must be an array.');
    }

    for (let i = 0; i < commands.length; i ++) {
      if (typeof commands[i] === 'string') {
        throw new Error('All commands must be placed inside a respective folder of their group inside the main commands folder.');
      } else if (typeof commands[i] !== 'object') {
        throw new TypeError('All command exports must be an instance of the command.');
      } else if ((commands[i] instanceof Command) === false) {
        throw new Error('All commands must inherit the Command class.');
      }

      for (let j = 0; j < commands[i].names.length; j++) {
        if (this.commands.some((x) => x.names.some((y) => y === commands[i].names[j])) === true) {
          throw new Error('A command with the name ' + commands[i].names[j] + ' is already registered.');
        }
      }

      for (let j = 0; j < commands[i].args.length; j++) {
        const typeReader = this.typeReaders.find((x) => x.type === commands[i].args[j].type);

        if (typeReader === undefined) {
          throw new Error('The ' + commands[i].args[j].type + ' type does not exist.');
        }

        commands[i].args[j].typeReader = typeReader;
      }

      const groupIndex = this.groups.findIndex((v) => v.name === commands[i].groupName);

      if (groupIndex === -1) {
        throw new Error('The ' + commands[i].groupName + ' group is not registered.');
      }

      commands[i].group = this.groups[groupIndex];
      this.groups[groupIndex].commands.push(commands[i]);
      this.commands.push(commands[i]);
    }

    return this;
  }

  /**
   * Validates a command.
   * @param {Registry} registry The registry to validate.
   * @private
   */
  static validateRegistry(registry) {
    if (typeof registry.library !== 'string') {
      throw new TypeError('Registry: The library must be a string.');
    } else if (Constants.libraries.indexOf(registry.library) === -1) {
      throw new TypeError('Registry: ' + registry.library + ' isn\'t a supported library.');
    }
  }
}

module.exports = Registry;
