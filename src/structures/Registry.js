const path = require('path');
const Command = require('./Command.js');
const Group = require('./Group.js');
const TypeReader = require('./TypeReader.js');
const TypeReaderCategories = require('../enums/TypeReaderCategories.js');
const Precondition = require('./Precondition.js');
const ArgumentPrecondition = require('./ArgumentPrecondition.js');
const Constants = require('../utility/Constants.js');
const Libraries = require('../enum/Libraries.js');
const LibraryHandler = require('../utility/LibraryHandler.js');
const RequireAll = require('../utility/RequireAll.js');

/**
 * A registry containing all commands, groups and type readers.
 * @prop {Command[]} commands All registered commands.
 * @prop {Group[]} groups All registered groups.
 * @prop {TypeReader[]} typeReaders All registered type readers.
 * @prop {Precondition[]} preconditions All registered preconditions.
 * @prop {ArgumentPrecondtion[]} argumentPreconditions All registered argument preconditions.
 * @prop {string} library The library being used.
 */
class Registry {
  /**
   * @typedef {object} RegistryOptions The registry options.
   * @prop {RegExp} [argumentRegex=/"[\S\s]+?"|[\S\n]+/g] The regex used to parse arguments from messages.
   * @prop {Symbol} library The library of the registry.
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
    this.argumentRegex = options.argumentRegex !== undefined ? options.argumentRegex : Constants.regexes.argument;
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
      } else if (this.preconditions.some((v) => v.name === preconditions[i].name) === true) {
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
      } else if (this.argumentPreconditions.some((v) => v.name === argumentPreconditions[i].name) === true) {
        throw new Error('The ' + argumentPreconditions[i].name + ' argument precondition already exists.');
      }

      this.argumentPreconditions.push(argumentPreconditions[i]);
    }

    return this;
  }

  /**
   * Registers all global type readers.
   * @returns {Registry} The registry being used.
   */
  registerGlobalTypeReaders() {
    return this.registerTypeReaders(RequireAll(path.join(__dirname, '/../readers', 'global')));
  }

  /**
   * Registers all library type readers.
   * @returns {Registry} The registry being used.
   */
  registerLibraryTypeReaders() {
    return this.registerTypeReaders(RequireAll(path.join(__dirname, '/../readers', this.library)));
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

      for (let j = 0; j < groups[i].preconditions.length; j++) {
        const name = typeof groups[i].preconditions[j] === 'string' ? groups[i].preconditions[j] : groups[i].preconditions[j].name;
        const options = groups[i].preconditions[j].options;
        const precondition = this.preconditions.find((x) => x.name === name);

        if (precondition === undefined) {
          throw new Error('The ' + name + ' precondition is not registered.');
        }

        groups[i].preconditions[j] = precondition;
        groups[i].preconditionOptions[j] = options;
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
        if (this.commands.some((x) => x.names.includes(commands[i].names[j])) === true) {
          throw new Error('A command with the name ' + commands[i].names[j] + ' is already registered.');
        }
      }

      for (let j = 0; j < commands[i].args.length; j++) {
        const typeReader = this.typeReaders.find((x) => x.type === commands[i].args[j].type);

        if (typeReader === undefined) {
          throw new Error('The ' + commands[i].args[j].type + ' type does not exist.');
        }

        commands[i].args[j].typeReader = typeReader;

        for (let h = 0; h < commands[i].args[j].preconditions.length; h++) {
          const name = typeof commands[i].args[j].preconditions[h] === 'string' ? commands[i].args[j].preconditions[h] : commands[i].args[j].preconditions[h].name;
          const options = commands[i].args[j].preconditions[h].options;
          const precondition = this.argumentPreconditions.find((x) => x.name === name);

          if (precondition === undefined) {
            throw new Error('The ' + name + ' argument precondition is not registered.');
          }

          commands[i].args[j].preconditions[h] = precondition;
          commands[i].args[j].preconditionOptions[h] = options;
        }
      }

      for (let j = 0; j < commands[i].preconditions.length; j++) {
        const name = typeof commands[i].preconditions[j] === 'string' ? commands[i].preconditions[j] : commands[i].preconditions[j].name;
        const options = commands[i].preconditions[j].options;
        const precondition = this.preconditions.find((x) => x.name === name);

        if (precondition === undefined) {
          throw new Error('The ' + name + ' precondition is not registered.');
        }

        commands[i].preconditions[j] = precondition;
        commands[i].preconditionOptions[j] = options;
      }

      const groupIndex = this.groups.findIndex((v) => v.name === commands[i].groupName);

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
      } else if (this.preconditions.every((p) => p.name !== preconditions[i].name) === true) {
        throw new Error('The ' + preconditions[i].name + ' precondition is already not registered.');
      } else if (this.commands.some((c) => c.preconditions.some((p) => p.name === preconditions[i].name)) === true) {
        throw new Error('The ' + preconditions[i].name + ' precondition is registered to a command.');
      } else if (this.groups.some((g) => g.preconditions.some((p) => p.name === preconditions[i].name)) === true) {
        throw new Error('The ' + preconditions[i].name + ' precondition is registered to a group.');
      }

      this.preconditions.splice(this.preconditions.findIndex((p) => p.name === preconditions[i].name), 1);
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
      } else if (this.argumentPreconditions.every((p) => p.name !== argumentPreconditions[i].name) === true) {
        throw new Error('The ' + argumentPreconditions[i].name + ' argument precondition is already not registered.');
      } else if (this.commands.some((c) => c.args.some((a) => a.preconditions.some((p) => p.name === argumentPreconditions[i].name))) === true) {
        throw new Error('The ' + argumentPreconditions[i].name + ' argument precondition is registered to a argument.');
      }

      this.argumentPreconditions.splice(this.argumentPreconditions.findIndex((p) => p.name === argumentPreconditions[i].name), 1);
    }

    return this;
  }

  /**
   * Unregisters all global type readers.
   * @returns {Registry} The registry being used.
   */
  unregisterGlobalTypeReaders() {
    return this.unregisterTypeReaders(this.typeReaders.filter((t) => t.category === TypeReaderCategories.Global));
  }

  /**
   * Unregisters all library type readers.
   * @returns {Registry} The registry being used.
   */
  unregisterLibraryTypeReaders() {
    return this.unregisterTypeReaders(this.typeReaders.filter((t) => t.category === TypeReaderCategories.Library));
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
      } else if (this.typeReaders.every((t) => t.type !== typeReaders[i].type) === true) {
        throw new Error('The ' + typeReaders[i].type + ' type reader is already not registered.');
      } else if (this.commands.some((c) => c.args.some((a) => a.typeReader.type === typeReaders[i].type)) === true) {
        throw new Error('The ' + typeReaders[i].type + ' type reader is registered to an argument.');
      }

      this.typeReaders.splice(this.typeReaders.findIndex((t) => t.type === typeReaders[i].type), 1);
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
      } else if (this.groups.every((g) => g.name !== groups[i].name) === true) {
        throw new Error('The ' + groups[i].name + ' group is already not registered.');
      } else if (groups[i].commands.length > 0) {
        throw new Error('The ' + groups[i].name + ' group has commands registered to it.');
      }

      this.groups.splice(this.groups.findIndex((g) => g.name === groups[i].name), 1);
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
      } else if (this.commands.every((c) => c.names[0] !== commands[i].names[0]) === true) {
        throw new Error('The ' + commands[i].names[0] + ' command is already not registered.');
      }

      this.commands.splice(this.commands.findIndex((c) => c.names[0] === commands[i].names[0]), 1);
      commands[i].group.commands.splice(commands[i].group.commands.findIndex((c) => c.names[0] === commands[i].names[0]), 1);
    }

    return this;
  }

  /**
   * Validates the registry.
   * @param {Registry} registry The registry to validate.
   * @private
   */
  static validateRegistry(registry) {
    if (Object.values(Libraries).indexOf(registry.library) === -1) {
      throw new TypeError(registry.library + ' isn\'t a supported library.');
    }
  }
}

module.exports = Registry;
