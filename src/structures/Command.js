const Argument = require('./Argument.js');
const Context = require('../enums/Context.js');
const Cooldown = require('./Cooldown.js');
const ContextKeys = Object.keys(Context);

/**
 * A command.
 * @prop {string[]} names The names of the command.
 * @prop {Group} group The group of the command.
 * @prop {string} description The description of the command.
 * @prop {Symbol[]} usableContexts An array of contexts the command can be used.
 * @prop {string[]} memberPermissions The permissions required by the invoker to use the command.
 * @prop {string[]} botPermissions The permissions required by the bot to execute the command.
 * @prop {Precondition[]} preconditions The preconditions to be ran on the command.
 * @prop {object[]} preconditionOptions The options to be passed to preconditions when they're run.
 * @prop {Postcondition[]} postconditions The postconditions to be ran on the command.
 * @prop {Argument[]} args The arguments of the command.
 * @prop {boolean} hasCooldown Whether the command has a cooldown.
 * @prop {?Cooldown} cooldowns An object of all user cooldowns and cooldown options on the command.
 */
class Command {
  /**
   * @typedef {object} CommandOptions The command options.
   * @prop {string[]} names The names of the command.
   * @prop {string} groupName The name of the group of the command.
   * @prop {string} [description=''] The description of the command.
   * @prop {Symbol[]} [usableContexts=[Context.Guild]] An array of contexts the command can be used.
   * @prop {string[]} [memberPermissions=[]] The permissions required by the invoker to use the command.
   * @prop {string[]} [botPermissions=[]] The permissions required by the bot to execute the command.
   * @prop {Array<string|object>} [postconditions=[]] The postconditions to be ran on the command.
   * @prop {Array<string|object>} [preconditions=[]] The preconditions to be ran on the command.
   * @prop {Array<object>} [preconditionOptions=[]] The options to be passed to preconditions when they're run.
   * @prop {Argument[]} [args=[]] The arguments of the command.
   * @prop {?number|object} cooldown The length of the cooldown in milliseconds or an object. See Cooldown class documentation for details on the object's structure.
   */

  /**
   * @param {CommandOptions} options The commands options.
   */
  constructor(options) {
    this.names = options.names;
    this.groupName = options.groupName;
    this.description = options.description == null ? '' : options.description;
    this.usableContexts = options.usableContexts == null ? [Context.Guild] : options.usableContexts;
    this.memberPermissions = options.memberPermissions == null ? [] : options.memberPermissions;
    this.botPermissions = options.botPermissions == null ? [] : options.botPermissions;
    this.preconditions = options.preconditions == null ? [] : options.preconditions;
    this.postconditions = options.postconditions == null ? [] : options.postconditions;
    this.args = options.args == null ? [] : options.args;
    this.hasCooldown = options.cooldown != null;
    if (this.hasCooldown) {
      this.cooldowns = new Cooldown(options.cooldown);
    }
    this.preconditionOptions = options.preconditionOptions == null ? [] : options.preconditionOptions;

    this.constructor.validateCommand(this, this.constructor.name);
  }

  /**
   * Executes the command.
   * @param {Message} message The received message.
   * @param {object} args The arguments of the command.
   * @param {...*} custom The custom parameters passed into the handler.
   * @abstract
   * @returns {Promise<?CommandResult>} Resolves once the execution of the command is complete.
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

      if (this.args[i].optional) {
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
   * Attempts to update the Command's cooldown.
   * @param {string} userId The user ID.
   * @param {?string} guildId The guild ID.
   * @returns {Promise<boolean>} Returns false if the user isn't on cooldown or no cooldown is set, and true if they are on cooldown.
   */
  async updateCooldown(userId, guildId) {
    if (!this.hasCooldown) {
      return false;
    }

    return this.cooldowns.use(userId, guildId);
  }

  /**
   * Attempts to revert the Command's cooldown.
   * @param {string} userId The user ID.
   * @param {?string} guildId The guild ID.
   * @returns {Promise} Resolves once the cooldown is reverted.
   */
  async revertCooldown(userId, guildId) {
    if (this.hasCooldown) {
      return this.cooldowns.revert(userId, guildId);
    }
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
    } else if (typeof command.groupName !== 'string') {
      throw new TypeError(name + ': The group name must be a string.');
    } else if (typeof command.description !== 'string') {
      throw new TypeError(name + ': The description must be a string.');
    } else if (Array.isArray(command.memberPermissions) === false) {
      throw new TypeError(name + ': The user permissions must be an array.');
    } else if (Array.isArray(command.botPermissions) === false) {
      throw new TypeError(name + ': The bot permissions must be an array.');
    } else if (Array.isArray(command.preconditions) === false) {
      throw new TypeError(name + ': The preconditions must be an array.');
    } else if (Array.isArray(command.preconditionOptions) === false) {
      throw new TypeError(name + ': The precondition options must be an array.');
    } else if (Array.isArray(command.postconditions) === false) {
      throw new TypeError(name + ': The postconditions must be an array.');
    } else if (Array.isArray(command.args) === false) {
      throw new TypeError(name + ': The arguments must be an array.');
    } else if (typeof command.cooldown !== 'number') {
      throw new TypeError(name + ': The cooldown must be a number.');
    } else if (Array.isArray(command.usableContexts) === false) {
      throw new TypeError(name + ': The usableContexts must be an array.');
    }

    const allPermissions = command.memberPermissions.concat(command.botPermissions);

    for (let i = 0; i < allPermissions.length; i++) {
      if (typeof allPermissions[i] !== 'string') {
        throw new TypeError(name + ': All permissions must be strings.');
      }
    }

    for (let i = 0; i < command.names.length; i++) {
      if (typeof command.names[i] !== 'string') {
        throw new TypeError(command.names[i] + ': All command names must be strings.');
      }
    }

    for (let i = 0; i < command.usableContexts.length; i++) {
      let valid = false;
      for (let j = 0; j < ContextKeys.length; j++) {
        if (Context[ContextKeys[j]] === command.usableContexts[i]) {
          valid = true;
          break;
        }
      }
      if (valid === false) {
        throw new TypeError(command.names[i] + ': Invalid Context.');
      }
    }

    for (let i = 0; i < command.args.length; i++) {
      if ((command.args[i] instanceof Argument) === false) {
        throw new TypeError(name + ': All arguments must be instances of the Argument class.');
      } else if (command.args[i].remainder && i !== command.args.length - 1) {
        throw new Error(name + ': Only the last argument of a command may be the remainder.');
      } else if (command.args[i].infinite && i !== command.args.length - 1) {
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
