const ArgumentDefault = require('../enums/ArgumentDefault.js');
const CooldownResult = require('../results/CooldownResult.js');
const ExceptionResult = require('../results/ExceptionResult.js');
const Constants = require('../utility/Constants.js');

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
   * @returns {Promise<Result>|Promise<CooldownResult>|Promise<TypeReaderResult>|Promise<PreconditionResult>|Promise<ExceptionResult>} The result of the command execution.
   */
  async run(message, prefix) {
    const split = message.content.slice(prefix.length).match(Constants.regexes.argument);

    if (split === null) {
      return Constants.results.commandNotFound;
    }

    const commandName = split.shift().toLowerCase();

    const command = this.registry.commands.find((x) => x.names.some((y) => y === commandName));

    if (command === undefined) {
      return Constants.results.commandNotFound;
    }

    if (message.guild !== null) {
      if (command.dmOnly === true) {
        return Constants.results.dmOnly(command);
      }

      const result = this.registry.libraryHandler.validatePermissions(command, message);

      if (result !== undefined) {
        return result;
      }
    } else if (command.guildOnly === true) {
      return Constants.results.guildOnly(command);
    }

    const preconditions = command.group.preconditions.concat(command.preconditions);

    for (let i = 0; i < preconditions.length; i++) {
      try {
        const result = await preconditions[i].run(command, message);

        if (result.success === false) {
          return result;
        }
      } catch (err) {
        return ExceptionResult.fromError(command, err);
      }
    }

    if (command.hasCooldown === true) {
      const cooldown = command.cooldowns.get(message.author.id + (message.guild !== null ? message.guild.id : ''));

      if (cooldown !== undefined) {
        const difference = cooldown - Date.now();

        if (difference > 0) {
          return CooldownResult.fromError(command, command.cooldown, difference);
        }
      }
    }

    const args = {};

    for (let i = 0; i < command.args.length; i++) {
      let value = [];
      let defaultValue = false;

      if (command.args[i].infinite === true) {
        if (split.length === 0) {
          if (command.args[i].optional === true) {
            value = this.defaultValue(command.args[i], message);
            defaultValue = true;
          } else {
            return Constants.results.invalidArgCount(command);
          }
        } else {
          for (let j = 0; j < split.length; j++) {
            if (Constants.regexes.quotesMatch.test(split[j]) === true) {
              split[j] = split[j].replace(Constants.regexes.quotes, '');
            }

            const typeReaderResult = await command.args[i].typeReader.read(command, message, command.args[i], args, split[j]);

            if (typeReaderResult.success === false) {
              return typeReaderResult;
            }

            value.push(typeReaderResult.value);
          }
        }
      } else {
        let input = command.args[i].remainder === true ? split.join(' ') : split.shift();

        if (Constants.regexes.quotesMatch.test(input) === true) {
          input = input.replace(Constants.regexes.quotes, '');
        }

        if (input === undefined || input === '') {
          if (command.args[i].optional === false) {
            return Constants.results.invalidArgCount(command);
          }

          value = this.defaultValue(command.args[i], message);
          defaultValue = true;
        } else {
          const typeReaderResult = await command.args[i].typeReader.read(command, message, command.args[i], args, input);

          if (typeReaderResult.success === false) {
            return typeReaderResult;
          }

          value = typeReaderResult.value;
        }
      }

      if (defaultValue === false) {
        for (let j = 0; j < command.args[i].preconditions.length; j++) {
          try {
            const preconditionResult = await command.args[i].preconditions[j].run(command, message, command.args[i], args, value);

            if (preconditionResult.success === false) {
              return preconditionResult;
            }
          } catch (err) {
            return ExceptionResult.fromError(command, err);
          }
        }
      }

      args[command.args[i].key] = value;
    }

    try {
      await command.run(message, args);

      if (command.hasCooldown === true) {
        command.cooldowns.set(message.author.id + (message.guild !== null ? message.guild.id : ''), Date.now() + command.cooldown);
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
