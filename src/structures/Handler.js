const ArgumentDefault = require('../enums/ArgumentDefault.js');
const CooldownResult = require('../results/CooldownResult.js');
const ExceptionResult = require('../results/ExceptionResult.js');
const Constants = require('../utility/Constants.js');
const Context = require("../enums/Context.js");
const InvalidContextResult = require('../enums/InvalidContextResult.js');

/**
 * The command handler.
 * @prop {Registry} registry The registry used to instantiate the command handler.
 */
class Handler {
  /**
   * @param {Registry} registry The registry used to handle the commands.
   */
  constructor(registry) {
    this.registry = registry;
  }

  /**
   * Attempts to execute a command.
   * @param {Message} message The received message.
   * @param {string} prefix The prefix to use when handling the command.
   * @param {*} custom Any custom parameters to be passed into all preconditions, commands, and type readers.
   * @returns {Promise<Result>|Promise<CooldownResult>|Promise<TypeReaderResult>|Promise<PreconditionResult>|Promise<ExceptionResult>} The result of the command execution.
   */
  async run(message, prefix, ...custom) {
    try {
      let content = message.content.slice(prefix.length);
      const split = content.match(this.registry.argumentRegex);

      if (split === null) {
        return Constants.results.commandNotFound('');
      }

      const commandName = split.shift().toLowerCase();
      content = content.slice((split.length > 0) ? content.indexOf(split[0]) : content.length);

      var command = this.registry.commands.find((x) => x.names.some((y) => y === commandName));

      if (command === undefined) {
        return Constants.results.commandNotFound(commandName);
      }

      if (message.guild !== null) {
        if (command.usableContexts.indexOf(Context.Guild) === -1) {
          return InvalidContextResult.from(command, Context.Guild);
        }

        const result = this.registry.libraryHandler.validatePermissions(command, message);

        if (result !== undefined) {
          return result;
        }
      } else {
        const result = this.registry.libraryHandler.validateContext(command, message);

        if (result !== undefined) {
          return result;
        }
      }

      for (let i = 0; i < command.preconditions.length; i++) {
        const result = await command.preconditions[i].run(command, message, command.preconditionOptions[i], ...custom);

        if (result.success === false) {
          return result;
        }
      }

      for (let i = 0; i < command.group.preconditions.length; i++) {
        const result = await command.group.preconditions[i].run(command, message, command.group.preconditionOptions[i], ...custom);

        if (result.success === false) {
          return result;
        }
      }

      if (command.hasCooldown === true) {
        const cooldown = command.cooldowns[message.author.id + (message.guild !== null ? '-' + message.guild.id : '')];

        if (cooldown !== undefined) {
          const difference = cooldown - Date.now();

          if (difference > 0) {
            return CooldownResult.fromError(command, difference);
          }
        }
      }

      const args = {};

      for (let i = 0; i < command.args.length; i++) {
        let value = [];

        if (command.args[i].infinite === true) {
          if (split.length === 0) {
            if (command.args[i].optional === true) {
              value = this.defaultValue(command.args[i], message);
            } else {
              return Constants.results.invalidArgCount(command);
            }
          } else {
            for (let j = 0; j < split.length; j++) {
              content = content.slice(content.indexOf(split[j]));
              if (Constants.regexes.quotesMatch.test(split[j]) === true) {
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
              content = content.slice((split.length > 0) ? content.indexOf(split[0]) : input.length);
            }
          }

          if (Constants.regexes.quotesMatch.test(input) === true) {
            input = input.replace(Constants.regexes.quotes, '');
          }

          if (input === undefined || input === '') {
            if (command.args[i].optional === false) {
              return Constants.results.invalidArgCount(command);
            }

            value = this.defaultValue(command.args[i], message);
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

      await command.run(message, args, ...custom);

      if (command.hasCooldown === true) {
        command.cooldowns[message.author.id + (message.guild !== null ? '-' + message.guild.id : '')] = Date.now() + command.cooldown;
      }

      return Constants.results.success(command);
    } catch (err) {
      return ExceptionResult.fromError(command, err);
    }
  }

  /**
   * The default value of an argument based off a command message.
   * @param {Argument} argument The argument being parsed.
   * @param {Message} message The received message.
   * @returns {*} The default value of the argument.
   * @private
   */
  defaultValue(argument, message) {
    switch (argument.defaultValue) {
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
        return message.member.highestRole;
      default:
        return argument.defaultValue;
    }
  }
}

module.exports = Handler;
