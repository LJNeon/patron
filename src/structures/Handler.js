const Result = require('../results/Result.js');
const ArgumentDefault = require('../enums/ArgumentDefault.js');
const CommandError = require('../enums/CommandError.js');
const CooldownResult = require('../results/CooldownResult.js');
const ExceptionResult = require('../results/ExceptionResult.js');
const PermissionUtil = require('../utility/PermissionUtil.js');
const regexes = require('../constants/regexes.js');

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
   * @param {Message} message The received message.
   * @param {string} prefix The prefix to use when handling the command.
   * @returns {Promise<Result> | Promise<CooldownResult> | Promise<TypeReaderResult> | Promise<PreconditionResult> | Promise<ExceptionResult>} The result of the command execution.
   */
  async run(message, prefix) {
    const split = message.content.match(regexes.argument);

    if (split === null) {
      return new Result({ success: false, commandError: CommandError.CommandNotFound, errorReason: 'This command does not exist.' });
    }

    const commandName = split.shift().slice(prefix.length).toLowerCase();

    let command = this.registry.commands.get(commandName);

    if (command === undefined) {
      const matches = this.registry.commands.filterArray((value) => value.aliases.some((v) => v === commandName));

      if (matches.length > 0) {
        command = matches[0];
      } else {
        return new Result({ success: false, commandError: CommandError.CommandNotFound, errorReason: 'This command does not exist.' });
      }
    }

    if (message.guild !== null) {
      if (command.memberPermissions.length > 0 && message.guild.member(message.author).hasPermission(command.memberPermissions) === false) {
        return new Result({ success: false, command: command, commandError: CommandError.MemberPermission, errorReason: 'This command may only be used by members with the ' + PermissionUtil.format(command.memberPermissions) + ' permission' + (command.memberPermissions.length > 1 ? 's' : '') + '.' });
      }

      if (command.botPermissions.length > 0 && message.guild.me.hasPermission(command.botPermissions) === false) {
        return new Result({ success: false, command: command, commandError: CommandError.BotPermission, errorReason: message.client.user.username + ' cannot execute this command without the ' + PermissionUtil.format(command.botPermissions) + ' permission' + (command.botPermissions.length > 1 ? 's' : '') + '.' });
      }
    } else if (command.guildOnly === true) {
      return new Result({ success: false, command: command, commandError: CommandError.GuildOnly, errorReason: 'This command may only be used inside a server.' });
    }

    for (const precondition of command.group.preconditions.concat(command.preconditions)) {
      try {
        const result = await precondition.run(command, message);

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
            return new Result({ success: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
          }
        } else {
          for (let input of split) {
            if (regexes.quotesMatch.test(input) === true) {
              input = input.replace(regexes.quotes, '');
            }

            const typeReaderResult = await command.args[i].type.read(command, message, command.args[i], input);

            if (typeReaderResult.success === false) {
              return typeReaderResult;
            }

            value.push(typeReaderResult.value);
          }
        }
      } else {
        let input = command.args[i].remainder === true ? split.join(' ') : split.shift();

        if (regexes.quotesMatch.test(input) === true) {
          input = input.replace(regexes.quotes, '');
        }

        if (input === undefined || input === '') {
          if (command.args[i].optional === false) {
            return new Result({ success: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
          }

          value = this.defaultValue(command.args[i], message);
          defaultValue = true;
        } else {
          const typeReaderResult = await command.args[i].type.read(command, message, command.args[i], input);

          if (typeReaderResult.success === false) {
            return typeReaderResult;
          }

          value = typeReaderResult.value;
        }
      }

      if (defaultValue === false) {
        for (const precondition of command.args[i].preconditions) {
          try {
            const preconditionResult = await precondition.run(command, message, command.args[i], value);

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

      return new Result({ success: true, command: command });
    } catch (err) {
      return ExceptionResult.fromError(command, err);
    }
  }

  /**
   * 
   * @param {Argument} argument The argument being parsed.
   * @param {Message} message The received message.
   * @returns {*} The default value of the argument.
   */
  defaultValue(argument, message) {
    switch (argument.defaultValue) {
      case ArgumentDefault.Author:
        return message.author;
      case ArgumentDefault.Member:
        return message.guild.member(message.author);
      case ArgumentDefault.Channel:
        return message.channel;
      case ArgumentDefault.Guild:
        return message.guild;
      case ArgumentDefault.HighestRole:
        return message.guild.member(message.author).highestRole;
      default:
        return argument.defaultValue;
    }
  }
}

module.exports = Handler;
