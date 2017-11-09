const Argument = require('./Argument.js');

/**
 * A command.
 * @prop {string[]} names The names of the command.
 * @prop {Group} group The group of the command.
 * @prop {string} description The description of the command.
 * @prop {boolean} guildOnly Whether the command may only be used in guild text channels.
 * @prop {boolean} dmOnly Whether the command may only be used in direct messages.
 * @prop {string[]} memberPermissions The permissions required by the invoker to use the command.
 * @prop {string[]} botPermissions The permissions required by the bot to execute the command.
 * @prop {Precondition[]} preconditions The preconditions to be ran on the command.
 * @prop {Argument[]} args The arguments of the command.
 * @prop {boolean} hasCooldown Whether the command has a cooldown.
 * @prop {number} cooldown The length of the cooldown in milliseconds.
 * @prop {object} cooldowns An object of all user cooldowns on the command.
 */
class Command {
  /**
   * @typedef {object} CommandOptions The command options.
   * @prop {string[]} names The names of the command.
   * @prop {string} groupName The name of the group of the command.
   * @prop {string} [description=''] The description of the command.
   * @prop {boolean} [guildOnly=true] Whether the command may only be used in guild text channels.
   * @prop {boolean} [dmOnly=false] Whether the command may only be used in direct messages.
   * @prop {string[]} [memberPermissions=[]] The permissions required by the invoker to use the command.
   * @prop {string[]} [botPermissions=[]] The permissions required by the bot to execute the command.
   * @prop {Array<string|object>} [preconditions=[]] The preconditions to be ran on the command.
   * @prop {Argument[]} [args=[]] The arguments of the command.
   * @prop {number} [cooldown=0] The length of the cooldown in milliseconds.
   */

  /**
   * @param {CommandOptions} options The commands options.
   */
  constructor(options) {
    this.names = options.names;
    this.groupName = options.groupName;
    this.description = options.description !== undefined ? options.description : '';
    this.guildOnly = options.guildOnly !== undefined ? options.guildOnly : true;
    this.dmOnly = options.dmOnly !== undefined ? options.dmOnly : false;
    this.memberPermissions = options.memberPermissions !== undefined ? options.memberPermissions : [];
    this.botPermissions = options.botPermissions !== undefined ? options.botPermissions : [];
    this.preconditions = options.preconditions !== undefined ? options.preconditions : [];
    this.args = options.args !== undefined ? options.args : [];
    this.hasCooldown = options.cooldown !== undefined;
    this.cooldown = this.hasCooldown === true ? options.cooldown : 0;
    this.cooldowns = this.hasCooldown === true ? {} : null;
    this.preconditionOptions = [];

    this.constructor.validateCommand(this, this.constructor.name);
  }

  /**
   * Executes the command.
   * @param {Message} message The received message.
   * @param {object} args The arguments of the command.
   * @param {*} custom The custom parameters passed into the handler.
   * @abstract
   * @returns {Promise} Resolves once the execution of the command is complete.
   */
  async run(message, args, custom) {
    throw new Error(this.constructor.name + ' does not have a run method.');
  }

  /**
   * Creates the usage string of the command.
   * @returns {string} The usage of the command.
   */
  getUsage() {
    let usage = this.names[0];

    for (let i = 0; i < this.args.length; i ++) {
      let before = '<';
      let after = '>';

      if (this.args[i].optional === true) {
        before = '[';
        after = ']';
      }

      const type = this.args[i].typeReader.type;

      if (type === 'role' || type === 'member' || type === 'user') {
        before += '@';
      } else if (type === 'textchannel') {
        before += '#';
      }

      usage += ' ' + before + this.args[i].name + after;
    }

    return usage;
  }

  /**
   * Creates the example string of the command.
   * @returns {string} An example of usage of the command.
   */
  getExample() {
    let example = this.names[0];

    for (let i = 0; i < this.args.length; i++) {
      example += ' ' + this.args[i].example;
    }

    return example;
  }

  /**
   * Validates a command.
   * @param {Command} command The command to validate.
   * @param {string} name The name of the constructor of the command.
   * @private
   */
  static validateCommand(command, name) {
    if (Array.isArray(command.names) === false) {
      throw new TypeError(name + ': The names must be an array.');
    } else if (typeof command.groupName !== 'string' || command.groupName !== command.groupName.toLowerCase()) {
      throw new TypeError(name + ': The group name must be a lowercase string.');
    } else if (typeof command.description !== 'string') {
      throw new TypeError(name + ': The description must be a string.');
    } else if (typeof command.guildOnly !== 'boolean') {
      throw new TypeError(name + ': The guild only option must be a boolean.');
    } else if (typeof command.dmOnly !== 'boolean') {
      throw new TypeError(name + ': The DM only option must be a boolean.');
    } else if (command.dmOnly === true && command.guildOnly === true) {
      throw new Error(name + ': A command may not be DM only and guild only.');
    } else if (Array.isArray(command.memberPermissions) === false) {
      throw new TypeError(name + ': The user permissions must be an array.');
    } else if (Array.isArray(command.botPermissions) === false) {
      throw new TypeError(name + ': The bot permissions must be an array.');
    } else if (Array.isArray(command.preconditions) === false) {
      throw new TypeError(name + ': The preconditions must be an array.');
    } else if (Array.isArray(command.args) === false) {
      throw new TypeError(name + ': The arguments must be an array.');
    } else if (typeof command.cooldown !== 'number') {
      throw new TypeError(name + ': The cooldown must be a number.');
    }

    const allPermissions = command.memberPermissions.concat(command.botPermissions);

    for (let i = 0; i < allPermissions.length; i++) {
      if (typeof allPermissions[i] !== 'string') {
        throw new TypeError(name + ': All permissions must be strings.');
      }
    }

    for (let i = 0; i < command.names.length; i++) {
      if (typeof command.names[i] !== 'string' || command.names[i] !== command.names[i].toLowerCase()) {
        throw new TypeError(command.names[i] + ': All command names must be lowercase strings.');
      }
    }

    for (let i = 0; i < command.args.length; i++) {
      if ((command.args[i] instanceof Argument) === false) {
        throw new TypeError(name + ': All arguments must be instances of the Argument class.');
      } else if (command.args[i].remainder === true && i !== command.args.length - 1) {
        throw new Error(name + ': Only the last argument of a command may be the remainder.');
      } else if (command.args[i].infinite === true && i !== command.args.length - 1) {
        throw new Error(name + ': Only the last argument of a command may be infinite.');
      } else if (command.args.filter((value) => value.name === command.args[i].name).length > 1) {
        throw new Error(name + ': There is more than one argument by the name of ' + command.args[i].name + '.');
      } else if (command.args.filter((value) => value.key === command.args[i].key).length > 1) {
        throw new Error(name + ': There is more than one argument by the key of ' + command.args[i].key + '.');
      }
    }
  }
}

module.exports = Command;
