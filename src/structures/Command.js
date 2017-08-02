const discord = require('discord.js');
const Argument = require('./Argument.js');
const Precondition = require('./Precondition.js');

/**
 * @prop {string} name The name of the command.
 * @prop {string[]} aliases The aliases of the command.
 * @prop {Group} group The group of the command.
 * @prop {string} description The description of the command.
 * @prop {boolean} guildOnly Whether the command may only be used in guild text channels.
 * @prop {string[]} memberPermissions The permissions required by the invoker to use the command.
 * @prop {string[]} botPermissions The permissions required by the bot to execute the command.
 * @prop {Precondition[]} preconditions The preconditions to be ran on the command.
 * @prop {Argument[]} args The arguments of the command.
 * @prop {boolean} hasCooldown Whether the command has a cooldown.
 * @prop {number} cooldown The length of the cooldown in milliseconds.
 * @prop {Collection<string, number>} cooldowns The current collection of all user cooldowns on the command.
 */
class Command {
  /**
   * @typedef {object} CommandOptions The command options.
   * @prop {string} name The name of the command.
   * @prop {string[]} aliases The aliases of the command.
   * @prop {Group} group The group of the command.
   * @prop {string} description The description of the command.
   * @prop {boolean} [guildOnly=true] Whether the command may only be used in guild text channels.
   * @prop {string[]} memberPermissions The permissions required by the invoker to use the command.
   * @prop {string[]} botPermissions The permissions required by the bot to execute the command.
   * @prop {Precondition[]} preconditions The preconditions to be ran on the command.
   * @prop {Argument[]} args The arguments of the command.
   * @prop {number} cooldown The length of the cooldown in milliseconds.
   */

  /**
   * @param {CommandOptions} options
   */
  constructor(options) {
    this.name = options.name;
    this.aliases = options.aliases !== undefined ? options.aliases : [];
    this.group = options.group;
    this.description = options.description;
    this.guildOnly = options.guildOnly !== undefined ? options.guildOnly : true;
    this.memberPermissions = options.memberPermissions !== undefined ? options.memberPermissions : [];
    this.botPermissions = options.botPermissions !== undefined ? options.botPermissions : [];
    this.preconditions = options.preconditions !== undefined ? options.preconditions : [];
    this.args = options.args !== undefined ? options.args : [];
    this.hasCooldown = options.cooldown !== undefined;
    this.cooldown = this.hasCooldown === true ? options.cooldown : 0;
    this.cooldowns = this.hasCooldown === true ? new discord.Collection() : null;

    this.constructor.validateCommand(this, this.constructor.name);
  }

  /**
   * @param {Message} message The received message.
   * @param {object} args The arguments of the command.
   * @returns {Promise} Resolves once the execution of the command is complete.
   */
  async run(message, args) {
    throw new Error(this.constructor.name + ' does not have a run method.');
  }

  /**
   * @returns {string} The usage of the command.
   */
  getUsage() {
    let usage = this.name;

    for (const arg of this.args) {
      let before = '<';
      let after = '>';

      if (arg.optional) {
        before = '[';
        after = ']';
      }

      const type = arg.type.type;

      if (type === 'role' || type === 'member' || type === 'user') {
        before += '@';
      }

      if (type === 'textchannel') {
        before += '#';
      }

      usage += ' ' + before + arg.name + after;
    }

    return usage;
  }

  /**
   * @returns {string} An example of usage of the command.
   */
  getExample() {
    let example = this.name;

    for (const arg of this.args) {
      example += ' ' + arg.example;
    }

    return example;
  }

  /**
   * @param {Command} command The command to validate.
   * @param {string} name The name of the command.
   * @private
   */
  static validateCommand(command, name) {
    if (typeof command.name  !== 'string' || command.name !== command.name.toLowerCase()) {
      throw new TypeError(name + ': The name must be a lowercase string.');
    } else if (!Array.isArray(command.aliases)) {
      throw new TypeError(name + ': The aliases must be an array.');
    } else if (typeof command.group !== 'string' || command.name !== command.name.toLowerCase()) {
      throw new TypeError(name + ': The group must be a lowercase string.');
    } else if (typeof command.description !== 'string') {
      throw new TypeError(name + ': The description must be a string.');
    } else if (typeof command.guildOnly !== 'boolean') {
      throw new TypeError(name + ': The guild only option must be a boolean.');
    } else if (!Array.isArray(command.memberPermissions)) {
      throw new TypeError(name + ': The user permissions must be an array.');
    } else if (!Array.isArray(command.botPermissions)) {
      throw new TypeError(name + ': The bot permissions must be an array.');
    } else if (!Array.isArray(command.preconditions)) {
      throw new TypeError(name + ': The preconditions must be an array.');
    } else if (!Array.isArray(command.args)) {
      throw new TypeError(name + ': The arguments must be an array.');
    } else if (typeof command.cooldown !== 'number') {
      throw new TypeError(name + ': The cooldown must be a number.');
    }

    for (const permission of command.memberPermissions.concat(command.botPermissions)) {
      if (typeof permission !== 'string' || permission !== permission.toUpperCase()) {
        throw new TypeError(name + ': All permissions must be uppercase strings.');
      }
    }

    for (const alias of command.aliases) {
      if (typeof alias !== 'string' || alias !== alias.toLowerCase()) {
        throw new TypeError(name + ': All command aliases must be lowercase strings.');
      }
    }

    for (const arg of command.args) {
      if (!(arg instanceof Argument)) {
        throw new TypeError(name + ': All arguments must be instances of the Argument class.');
      } else if (arg.remainder && arg.name !== command.args[command.args.length - 1].name) {
        throw new Error(name + ': Only the last argument of a command may be the remainder.');
      } else if (arg.infinite && arg.name !== command.args[command.args.length - 1].name) {
        throw new Error(name + ': Only the last argument of a command may be infinite.');
      } else if (command.args.filter((value) => value.name === arg.name).length > 1) {
        throw new Error(name + ': There is more than one argument by the name of ' + arg.name + '.');
      } else if (command.args.filter((value) => value.key === arg.key).length > 1) {
        throw new Error(name + ': There is more than one argument by the key of ' + arg.key + '.');
      }
    }

    for (const precondition of command.preconditions) {
      if (typeof precondition !== 'object') {
        throw new TypeError(name + ': All precondition exports must be an instance of the precondition.');
      } else if (!(precondition instanceof Precondition)) {
        throw new TypeError(name + ': All command preconditions must inherit the Precondition class.');
      }
    }
  }
}

module.exports = Command;
