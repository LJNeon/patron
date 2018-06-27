const Registry = require('./Registry.js');
const ArgumentDefault = require('../enums/ArgumentDefault.js');
const CommandResult = require('../results/CommandResult.js');
const Constants = require('../utility/Constants.js');

/**
 * The command handler.
 * @prop {RegExp} argumentRegex The regex used to parse arguments from messages.
 * @prop {Registry} registry The registry used to instantiate the command handler.
 */
class Handler {
  /**
   * @typedef {object} HandlerOptions The handler options.
   * @prop {RegExp} [argumentRegex=/"[\S\s]+?"|[\S\n]+/g] The regex used to parse arguments from messages.
   * @prop {Registry} registry The registry used to handle the commands.
   */

  /**
   * @param {HandlerOptions} options The handler options.
   */
  constructor(options) {
    this.busy = false;
    this.queue = [];
    this.registry = options.registry;
    this.argumentRegex = options.argumentRegex === undefined ? Constants.regexes.argument : options.argumentRegex;

    this.constructor.validateHandler(this);
  }

  synchronize(task) {
    return new Promise((resolve, reject) => {
      this.queue.push([task, resolve, reject]);

      if (this.busy === false) {
        this.dequeue();
      }
    });
  }

  dequeue() {
    this.busy = true;
    const next = this.queue.shift();

    if (next) {
      this.execute(next);
    } else {
      this.busy = false;
    }
  }

  execute(record) {
    record[0]().then(record[1], record[2]).then(() => this.dequeue());
  }

  /**
   * Attempts to parse a Command.
   * @param {Message} message The received message.
   * @param {number} prefixLength The length of the prefix to use when handling the command.
   * @returns {Promise<Result>} The result of the command parsing.
   */
  async parseCommand(message, prefixLength) {
    const split = message.content.slice(prefixLength).match(this.argumentRegex);

    if (split === null) {
      return Constants.results.commandNotFound('');
    }

    const command = this.registry.commands.find((c) => c.names.some((n) => this.registry.equals(n, split[0])));

    if (command === undefined) {
      return Constants.results.commandNotFound(split[0]);
    }

    return Constants.results.success(command);
  }

  /**
   * Attempts to validate a Command.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @returns {Promise<Result>|Promise<InvalidContextResult>} The result of the command validation.
   */
  async validateCommand(message, command) {
    const result = this.registry.libraryHandler.validateContext(command, message);

    if (result === undefined) {
      return Constants.results.success(command);
    }

    return result;
  }

  /**
   * Attempts to run the Preconditions registered to a Command.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @param {...*} custom Any custom parameters to be passed into all preconditions.
   * @returns {Promise<Result>|Promise<PreconditionResult>} The result of running the preconditions.
   */
  async runCommandPreconditions(message, command, ...custom) {
    for (let i = 0; i < command.group.preconditions.length; i++) {
      const result = await command.group.preconditions[i].run(command, message, command.group.preconditionOptions[i], ...custom);

      if (result.success === false) {
        return result;
      }
    }

    for (let i = 0; i < command.preconditions.length; i++) {
      const result = await command.preconditions[i].run(command, message, command.preconditionOptions[i], ...custom);

      if (result.success === false) {
        return result;
      }
    }

    return Constants.results.success(command);
  }

  /**
   * Attempts to run the Postconditions registered to a Command.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @param {?CommandResult} result The command result.
   * @param {...*} custom Any custom parameters to be passed into all postconditions.
   */
  async runCommandPostconditions(message, command, result, ...custom) {
    if (result instanceof CommandResult) {
      result.setCommand(command);
    }

    for (let i = 0; i < command.group.postconditions.length; i++) {
      await command.group.postconditions[i].run(message, result, ...custom);
    }

    for (let i = 0; i < command.postconditions.length; i++) {
      await command.postconditions[i].run(message, result, ...custom);
    }
  }

  /**
   * Attempts to update a Command's cooldown.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @returns {Promise<Result>|Promise<CooldownResult>} The result of checking the cooldowns.
   */
  async updateCooldown(message, command) {
    return this.synchronize(async () => {
      if (command.hasCooldown === true) {
        const guild = this.registry.libraryHandler.guild(message);
        const cooldown = command.cooldowns[message.author.id + (guild === null ? '' : '-' + guild.id)];

        if (cooldown !== undefined) {
          const difference = cooldown - Date.now();

          if (difference > 0) {
            return Constants.results.cooldown(command, difference);
          }
        }

        command.cooldowns[message.author.id + (guild == null ? '' : '-' + guild.id)] = Date.now() + command.cooldown;
      }

      return Constants.results.success(command);
    });
  }

  /**
   * Attempts to parse Arguments.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @param {number} prefixLength The length of the prefix to use when handling the command.
   * @param {...*} custom Any custom parameters to be passed into all preconditions and typereaders.
   * @returns {Promise<ArgumentResult>|Promise<TypeReaderResult>|Promise<PreconditionResult>} The result of the argument parsing.
   */
  async parseArguments(message, command, prefixLength, ...custom) {
    let content = message.content.slice(prefixLength);
    const args = {};
    let split = content.match(this.argumentRegex);

    if (split.length > 1) {
      content = content.slice(content.indexOf(split[1], split[0].length));
    } else {
      content = '';
    }

    split = split.slice(1);

    for (let i = 0; i < command.args.length; i++) {
      let value = [];

      if (command.args[i].infinite === true) {
        if (split.length === 0) {
          if (command.args[i].optional === true) {
            value = this.defaultValue(command.args[i].defaultValue, message);
          } else {
            return Constants.results.invalidArgCount(command);
          }
        } else {
          for (let j = 0; j < split.length; j++) {
            content = content.slice(content.indexOf(split[j]));
            if (this.registry.argumentRegex === Constants.regexes.argument && Constants.regexes.quotesMatch.test(split[j]) === true) {
              split[j] = split[j].replace(Constants.regexes.quotes, '');
            }

            const typeReaderResult = await command.args[i].typeReader.read(command, message, command.args[i], args, split[j], ...custom);

            if (typeReaderResult.success === false) {
              return typeReaderResult;
            }

            value.push(typeReaderResult.value);
          }
        }
      } else {
        let input = content;

        if (command.args[i].remainder === false) {
          input = split.shift();

          if (input !== undefined) {
            if (split.length > 0) {
              content = content.slice(content.indexOf(split[0], input.length));
            } else {
              content = '';
            }
          }
        }

        if (this.argumentRegex === Constants.regexes.argument && Constants.regexes.quotesMatch.test(input) === true) {
          input = input.replace(Constants.regexes.quotes, '');
        }

        if (input === undefined || input === '') {
          if (command.args[i].optional === false) {
            return Constants.results.invalidArgCount(command);
          }

          value = this.defaultValue(command.args[i].defaultValue, message);
        } else {
          const typeReaderResult = await command.args[i].typeReader.read(command, message, command.args[i], args, input, ...custom);

          if (typeReaderResult.success === false) {
            return typeReaderResult;
          }

          value = typeReaderResult.value;
        }
      }

      for (let j = 0; j < command.args[i].preconditions.length; j++) {
        const preconditionResult = await command.args[i].preconditions[j].run(command, message, command.args[i], args, value, command.args[i].preconditionOptions[j], ...custom);

        if (preconditionResult.success === false) {
          return preconditionResult;
        }
      }
      args[command.args[i].key] = value;
    }

    return Constants.results.args(command, args);
  }

  /** Attempts to revert a Command's cooldown.
   * @param {Message} message The received message.
   * @param {Command} command The parsed command.
   * @returns {Promise<Result>} The result of the cooldown's update.
   */
  async revertCooldown(message, command) {
    return this.synchronize(async () => {
      if (command.hasCooldown === true) {
        const guild = this.registry.libraryHandler.guild(message);
        command.cooldowns[message.author.id + (guild == null ? '' : '-' + guild.id)] = undefined;
      }

      return Constants.results.success(command);
    });
  }

  /**
   * Attempts to execute a command.
   * @param {Message} message The received message.
   * @param {number} prefixLength The length of the prefix to use when handling the command.
   * @param {...*} custom Any custom parameters to be passed into all preconditions, commands, and type readers.
   * @returns {Promise<Result>|Promise<ArgumentResult>|Promise<CooldownResult>|Promise<TypeReaderResult>|Promise<PreconditionResult>|Promise<ExceptionResult>} The result of the command execution.
   */
  async run(message, prefixLength, ...custom) {
    let command;
    let cooldownApplied = false;

    try {
      let result = await this.parseCommand(message, prefixLength);

      if (result.success === false) {
        return result;
      }

      command = result.command;
      result = await this.validateCommand(message, command);

      if (result.success === false) {
        return result;
      }

      result = await this.updateCooldown(message, command);

      if (result.success === false) {
        return result;
      }

      cooldownApplied = true;
      result = await this.runCommandPreconditions(message, command, ...custom);

      if (result.success === false) {
        await this.revertCooldown(message, command);
        await this.runCommandPostconditions(message, command, result, ...custom);

        return result;
      }

      result = await this.parseArguments(message, command, prefixLength, ...custom);

      if (result.success === false) {
        await this.revertCooldown(message, command);
        await this.runCommandPostconditions(message, command, result, ...custom);

        return result;
      }

      result = await command.run(message, result.args, ...custom);
      await this.runCommandPostconditions(message, command, result, ...custom);

      if (result instanceof CommandResult) {
        return result;
      }

      return Constants.results.success(command);
    } catch (err) {
      if (cooldownApplied === true) {
        await this.revertCooldown(message, command);
      }

      if (command !== undefined) {
        await this.runCommandPostconditions(message, command, err, ...custom);
      }

      return Constants.results.exception(command, err);
    }
  }

  /**
   * The default value of an argument based off a command message.
   * @param {*} defaultValue The defaultValue being parsed.
   * @param {Message} message The received message.
   * @returns {*} The default value of the argument.
   * @private
   */
  defaultValue(defaultValue, message) {
    switch (defaultValue) {
      case ArgumentDefault.Author:
        return message.author;
      case ArgumentDefault.Message:
        return message;
      case ArgumentDefault.Member:
        return message.member;
      case ArgumentDefault.Channel:
        return message.channel;
      case ArgumentDefault.Guild:
        return message.guild;
      case ArgumentDefault.HighestRole:
        return this.registry.libraryHandler.highestRole(message);
      default:
        return defaultValue;
    }
  }

  /**
   * Validates the handler.
   * @param {Handler} handler The handler to validate.
   * @private
   */
  static validateHandler(handler) {
    if (typeof handler.registry !== 'object') {
      throw new TypeError('Handler.registry must be an instance of the registry.');
    } else if ((handler.registry instanceof Registry) === false) {
      throw new TypeError('Handler.registry must inherit the Registry class.');
    } else if ((handler.argumentRegex instanceof RegExp) === false) {
      throw new TypeError('Handler.argumentRegex must be a regex.');
    }
  }
}

module.exports = Handler;
