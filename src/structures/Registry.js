const path = require('path');
const ArgumentPrecondition = require('./ArgumentPrecondition.js');
const Command = require('./Command.js');
const Group = require('./Group.js');
const Precondition = require('./Precondition.js');
const Postcondition = require('./Postcondition.js');
const TypeReader = require('./TypeReader.js');
const TypeReaderCategory = require('../enums/TypeReaderCategory.js');
const Library = require('../enums/Library.js');
const LibraryHandler = require('../utility/LibraryHandler.js');
const RequireAll = require('../utility/RequireAll.js');

/**
 * A registry containing all commands, groups and type readers.
 * @prop {Command[]} commands All registered commands.
 * @prop {Group[]} groups All registered groups.
 * @prop {TypeReader[]} typeReaders All registered type readers.
 * @prop {Precondition[]} preconditions All registered preconditions.
 * @prop {ArgumentPrecondtion[]} argumentPreconditions All registered argument preconditions.
 * @prop {Postcondition[]} postconditions All registered postconditions.
 * @prop {string} library The library being used.
 */
class Registry {
  /**
   * @typedef {object} RegistryOptions The registry options.
   * @prop {boolean} [caseSensitive=true] Whether or not patron treats strings as case-sensitive.
   * @prop {string} library The library of the registry.
   */

  /**
   * @param {RegistryOptions} options The registry options.
   */
  constructor(options) {
    this.commands = [];
    this.groups = [];
    this.typeReaders = [];
    this.preconditions = [];
    this.argumentPreconditions = [];
    this.postconditions = [];
    this.caseSensitive = options.caseSensitive == null ? true : options.caseSensitive;
    this.library = options.library;
    this.libraryHandler = new LibraryHandler({ library: this.library });

    this.constructor.validateRegistry(this);
    RequireAll(path.join(__dirname, '/../extensions', this.library));
  }

  /**
   * Registers an array of preconditions.
   * @param {Precondition[]} preconditions An array of preconditions to be registered.
   * @returns {Registry} The registry being used.
   */
  registerPreconditions(preconditions) {
    if (Array.isArray(preconditions) === false) {
      throw new TypeError('Preconditions must be an array.');
    }

    for (let i = 0; i < preconditions.length; i ++) {
      if (typeof preconditions[i] !== 'object') {
        throw new TypeError('All precondition exports must be an instance of the precondition.');
      } else if ((preconditions[i] instanceof Precondition) === false) {
        throw new Error('All preconditions must inherit the Precondition class.');
      } else if (this.preconditions.some((v) => this.equals(v.name, preconditions[i].name))) {
        throw new Error('The ' + preconditions[i].name + ' preconditon already exists.');
      }

      this.preconditions.push(preconditions[i]);
    }

    return this;
  }

  /**
   * Registers an array of argument preconditions.
   * @param {Precondition[]} argumentPreconditions An array of argument preconditions to be registered.
   * @returns {Registry} The registry being used.
   */
  registerArgumentPreconditions(argumentPreconditions) {
    if (Array.isArray(argumentPreconditions) === false) {
      throw new TypeError('ArgumentPreconditions must be an array.');
    }

    for (let i = 0; i < argumentPreconditions.length; i ++) {
      if (typeof argumentPreconditions[i] !== 'object') {
        throw new TypeError('All argument precondition exports must be an instance of the precondition.');
      } else if ((argumentPreconditions[i] instanceof ArgumentPrecondition) === false) {
        throw new Error('All argument preconditions must inherit the ArgumentPrecondition class.');
      } else if (this.argumentPreconditions.some((v) => this.equals(v.name, argumentPreconditions[i].name))) {
        throw new Error('The ' + argumentPreconditions[i].name + ' argument precondition already exists.');
      }

      this.argumentPreconditions.push(argumentPreconditions[i]);
    }

    return this;
  }

  /**
   * Registers an array of postconditions.
   * @param {Postcondition[]} postconditions An array of postconditions to be registered.
   * @returns {Registry} The registry being used.
   */
  registerPostconditions(postconditions) {
    if (Array.isArray(postconditions) === false) {
      throw new TypeError('Postcondition must be an array.');
    }

    for (let i = 0; i < postconditions.length; i ++) {
      if (typeof postconditions[i] !== 'object') {
        throw new TypeError('All postcondition exports must be an instance of the postcondition.');
      } else if ((postconditions[i] instanceof Postcondition) === false) {
        throw new Error('All postconditions must inherit the Postcondition class.');
      } else if (this.preconditions.some((v) => this.equals(v.name, postconditions[i].name))) {
        throw new Error('The ' + postconditions[i].name + ' postcondition already exists.');
      }

      this.postconditions.push(postconditions[i]);
    }

    return this;
  }

  /**
   * Registers all global type readers.
   * @returns {Promise<Registry>} The registry being used.
   */
  async registerGlobalTypeReaders() {
    return this.registerTypeReaders(await RequireAll(path.join(__dirname, '/../readers', 'global')));
  }

  /**
   * Registers all library type readers.
   * @returns {Promise<Registry>} The registry being used.
   */
  async registerLibraryTypeReaders() {
    return this.registerTypeReaders(await RequireAll(path.join(__dirname, '/../readers', this.library)));
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
      } else if (this.typeReaders.some((v) => this.equals(v.type, typeReaders[i].type))) {
        throw new Error('The ' + typeReaders[i].type + ' type reader already exists.');
      }

      this.typeReaders.push(typeReaders[i]);
    }

    return this;
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
      } else if (this.groups.some((v) => this.equals(v.name, groups[i].name))) {
        throw new Error('The ' + groups[i].name + ' group already exists.');
      }

      for (let j = 0; j < groups[i].preconditions.length; j++) {
        const name = typeof groups[i].preconditions[j] === 'string' ? groups[i].preconditions[j] : groups[i].preconditions[j].name;
        const precondition = this.preconditions.find((x) => this.equals(x.name, name));

        if (precondition == null) {
          throw new Error('The ' + name + ' precondition is not registered.');
        }

        groups[i].preconditions[j] = precondition;
      }

      for (let j = 0; j < groups[i].postconditions.length; j++) {
        const name = typeof groups[i].postconditions[j] === 'string' ? groups[i].postconditions[j] : groups[i].postconditions[j].name;
        const postcondition = this.postconditions.find((x) => this.equals(x.name, name));

        if (postcondition == null) {
          throw new Error('The ' + name + ' postcondition is not registered.');
        }

        groups[i].postconditions[j] = postcondition;
      }

      this.groups.push(groups[i]);
    }

    return this;
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

    for (let i = 0; i < commands.length; i++) {
      if (typeof commands[i] !== 'object') {
        throw new TypeError('All command exports must be an instance of the command.');
      } else if ((commands[i] instanceof Command) === false) {
        throw new Error('All commands must inherit the Command class.');
      }

      for (let j = 0; j < commands[i].names.length; j++) {
        if (this.commands.some((x) => x.names.some((n) => this.equals(n, commands[i].names[j])))) {
          throw new Error('A command with the name ' + commands[i].names[j] + ' is already registered.');
        }
      }

      for (let j = 0; j < commands[i].args.length; j++) {
        const typeReader = this.typeReaders.find((x) => this.equals(x.type, commands[i].args[j].type));

        if (typeReader == null) {
          throw new Error('The ' + commands[i].args[j].type + ' type does not exist.');
        }

        commands[i].args[j].typeReader = typeReader;

        for (let h = 0; h < commands[i].args[j].preconditions.length; h++) {
          const name = typeof commands[i].args[j].preconditions[h] === 'string' ? commands[i].args[j].preconditions[h] : commands[i].args[j].preconditions[h].name;
          const precondition = this.argumentPreconditions.find((x) => this.equals(x.name, name));

          if (precondition == null) {
            throw new Error('The ' + name + ' argument precondition is not registered.');
          }

          commands[i].args[j].preconditions[h] = precondition;
        }
      }

      for (let j = 0; j < commands[i].preconditions.length; j++) {
        const name = typeof commands[i].preconditions[j] === 'string' ? commands[i].preconditions[j] : commands[i].preconditions[j].name;
        const precondition = this.preconditions.find((x) => this.equals(x.name, name));

        if (precondition == null) {
          throw new Error('The ' + name + ' precondition is not registered.');
        }

        commands[i].preconditions[j] = precondition;
      }

      for (let j = 0; j < commands[i].postconditions.length; j++) {
        const name = typeof commands[i].postconditions[j] === 'string' ? commands[i].postconditions[j] : commands[i].postconditions[j].name;
        const postcondition = this.postconditions.find((x) => this.equals(x.name, name));

        if (postcondition == null) {
          throw new Error('The ' + name + ' postcondition is not registered.');
        }

        commands[i].postconditions[j] = postcondition;
      }

      const groupIndex = this.groups.findIndex((v) => this.equals(v.name, commands[i].groupName));

      if (groupIndex === -1) {
        throw new Error('The ' + commands[i].groupName + ' group is not registered.');
      }

      delete commands[i].groupName;
      commands[i].group = this.groups[groupIndex];
      this.groups[groupIndex].commands.push(commands[i]);
      this.commands.push(commands[i]);
    }

    return this;
  }

  /**
   * Unregisters an array of preconditions.
   * @param {Precondition[]} preconditions An array of preconditions to be unregistered.
   * @returns {Registry} The registry being used.
   */
  unregisterPreconditions(preconditions) {
    if (Array.isArray(preconditions) === false) {
      throw new TypeError('Preconditions must be an array.');
    }

    for (let i = 0; i < preconditions.length; i ++) {
      if (typeof preconditions[i] !== 'object') {
        throw new TypeError('All precondition exports must be an instance of the precondition.');
      } else if ((preconditions[i] instanceof Precondition) === false) {
        throw new Error('All preconditions must inherit the Precondition class.');
      } else if (this.preconditions.every((p) => this.equals(p.name, preconditions[i].name) === false)) {
        throw new Error('The ' + preconditions[i].name + ' precondition is already not registered.');
      } else if (this.commands.some((c) => c.preconditions.some((p) => this.equals(p.name, preconditions[i].name)))) {
        throw new Error('The ' + preconditions[i].name + ' precondition is registered to a command.');
      } else if (this.groups.some((g) => g.preconditions.some((p) => this.equals(p.name, preconditions[i].name)))) {
        throw new Error('The ' + preconditions[i].name + ' precondition is registered to a group.');
      }

      this.preconditions.splice(this.preconditions.findIndex((p) => this.equals(p.name, preconditions[i].name)), 1);
    }

    return this;
  }

  /**
   * Unregisters an array of argument preconditions.
   * @param {Precondition[]} argumentPreconditions An array of argument preconditions to be unregistered.
   * @returns {Registry} The registry being used.
   */
  unregisterArgumentPreconditions(argumentPreconditions) {
    if (Array.isArray(argumentPreconditions) === false) {
      throw new TypeError('ArgumentPreconditions must be an array.');
    }

    for (let i = 0; i < argumentPreconditions.length; i ++) {
      if (typeof argumentPreconditions[i] !== 'object') {
        throw new TypeError('All argument precondition exports must be an instance of the precondition.');
      } else if ((argumentPreconditions[i] instanceof ArgumentPrecondition) === false) {
        throw new Error('All argument preconditions must inherit the ArgumentPrecondition class.');
      } else if (this.argumentPreconditions.every((p) => this.equals(p.name, argumentPreconditions[i].name) === false)) {
        throw new Error('The ' + argumentPreconditions[i].name + ' argument precondition is already not registered.');
      } else if (this.commands.some((c) => c.args.some((a) => a.preconditions.some((p) => this.equals(p.name, argumentPreconditions[i].name))))) {
        throw new Error('The ' + argumentPreconditions[i].name + ' argument precondition is registered to a argument.');
      }

      this.argumentPreconditions.splice(this.argumentPreconditions.findIndex((p) => this.equals(p.name, argumentPreconditions[i].name)), 1);
    }

    return this;
  }

  /**
   * Unregisters an array of postconditions.
   * @param {Postcondition[]} postconditions An array of postconditions to be unregistered.
   * @returns {Registry} The registry being used.
   */
  unregisterPostconditions(postconditions) {
    if (Array.isArray(postconditions) === false) {
      throw new TypeError('Preconditions must be an array.');
    }

    for (let i = 0; i < postconditions.length; i ++) {
      if (typeof postconditions[i] !== 'object') {
        throw new TypeError('All postcondition exports must be an instance of the postcondition.');
      } else if ((postconditions[i] instanceof Precondition) === false) {
        throw new Error('All postconditions must inherit the Postcondition class.');
      } else if (this.postconditions.every((p) => this.equals(p.name, postconditions[i].name) === false)) {
        throw new Error('The ' + postconditions[i].name + ' postcondition is already not registered.');
      } else if (this.commands.some((c) => c.postconditions.some((p) => this.equals(p.name, postconditions[i].name)))) {
        throw new Error('The ' + postconditions[i].name + ' postcondition is registered to a command.');
      } else if (this.groups.some((g) => g.postconditions.some((p) => this.equals(p.name, postconditions[i].name)))) {
        throw new Error('The ' + postconditions[i].name + ' postcondition is registered to a group.');
      }

      this.postconditions.splice(this.postconditions.findIndex((p) => this.equals(p.name, postconditions[i].name)), 1);
    }

    return this;
  }

  /**
   * Unregisters all global type readers.
   * @returns {Registry} The registry being used.
   */
  unregisterGlobalTypeReaders() {
    return this.unregisterTypeReaders(this.typeReaders.filter((t) => t.category === TypeReaderCategory.Global));
  }

  /**
   * Unregisters all library type readers.
   * @returns {Registry} The registry being used.
   */
  unregisterLibraryTypeReaders() {
    return this.unregisterTypeReaders(this.typeReaders.filter((t) => t.category === TypeReaderCategory.Library));
  }

  /**
   * Unregisters an array of type readers.
   * @param {TypeReader[]} typeReaders An array of type readers to unregister.
   * @returns {Registry} The registry being used.
   */
  unregisterTypeReaders(typeReaders) {
    if (Array.isArray(typeReaders) === false) {
      throw new TypeError('TypeReaders must be an array.');
    }

    for (let i = 0; i < typeReaders.length; i++) {
      if (typeof typeReaders[i] !== 'object') {
        throw new TypeError('All type reader exports must be an instance of the type reader.');
      } else if ((typeReaders[i] instanceof TypeReader) === false) {
        throw new Error('All type readers must be inherit the TypeReader class.');
      } else if (this.typeReaders.every((t) => this.equals(t.type, typeReaders[i].type) === false)) {
        throw new Error('The ' + typeReaders[i].type + ' type reader is already not registered.');
      } else if (this.commands.some((c) => c.args.some((a) => this.equals(a.typeReader.type, typeReaders[i].type)))) {
        throw new Error('The ' + typeReaders[i].type + ' type reader is registered to an argument.');
      }

      this.typeReaders.splice(this.typeReaders.findIndex((t) => this.equals(t.type, typeReaders[i].type)), 1);
    }

    return this;
  }

  /**
   * Unregisters an array of groups.
   * @param {Group[]} groups An array of groups to be unregistered.
   * @returns {Registry} The registry being used.
   */
  unregisterGroups(groups) {
    if (Array.isArray(groups) === false) {
      throw new TypeError('Groups must be an array.');
    }

    for (let i = 0; i < groups.length; i ++) {
      if (typeof groups[i] !== 'object') {
        throw new TypeError('All group exports must be an instance of the group.');
      } else if ((groups[i] instanceof Group) === false) {
        throw new Error('All groups must inherit the Group class.');
      } else if (this.groups.every((g) => this.equals(g.name, groups[i].name) === false)) {
        throw new Error('The ' + groups[i].name + ' group is already not registered.');
      } else if (groups[i].commands.length > 0) {
        throw new Error('The ' + groups[i].name + ' group has commands registered to it.');
      }

      this.groups.splice(this.groups.findIndex((g) => this.equals(g.name, groups[i].name)), 1);
    }

    return this;
  }

  /**
   * Unregisters an array of commands.
   * @param {Command[]} commands An array of commands to unregister.
   * @returns {Registry} The registry being used.
   */
  unregisterCommands(commands) {
    if (Array.isArray(commands) === false) {
      throw new TypeError('Commands must be an array.');
    }

    for (let i = 0; i < commands.length; i ++) {
      if (typeof commands[i] !== 'object') {
        throw new TypeError('All command exports must be an instance of the command.');
      } else if ((commands[i] instanceof Command) === false) {
        throw new Error('All commands must inherit the Command class.');
      } else if (this.commands.every((c) => c.names.every((n) => commands[i].names.every((m) => this.equals(n, m) === false)))) {
        throw new Error('The ' + commands[i].names[0] + ' command is already not registered.');
      }

      this.commands.splice(this.commands.findIndex((c) => c.names.some((n) => commands[i].names.some((m) => this.equals(n, m)))), 1);
      commands[i].group.commands.splice(commands[i].group.commands.findIndex((c) => c.names.some((n) => commands[i].names.some((m) => this.equals(n, m)))), 1);
    }

    return this;
  }

  equals(zero, one) {
    if (this.caseSensitive) {
      return zero === one;
    }
    return zero.toLowerCase() === one.toLowerCase();
  }

  /**
   * Validates the registry.
   * @param {Registry} registry The registry to validate.
   * @private
   */
  static validateRegistry(registry) {
    if (Object.values(Library).indexOf(registry.library) === -1) {
      throw new TypeError(registry.library + ' isn\'t a supported library.');
    }
  }
}

module.exports = Registry;
