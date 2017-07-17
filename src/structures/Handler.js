const Parser = require('./Parser.js');
const Result = require('../results/Result.js');
const CommandError = require('../enums/CommandError.js');
const CooldownResult = require('../results/CooldownResult.js');
const ExceptionResult = require('../results/ExceptionResult.js');
const PermissionUtil = require('../utility/PermissionUtil.js');
const regexes = require('../constants/regexes.js');

/**
 * The command handler.
 * @prop {Registry} registry The registry used to instantiate the command handler.
 * @prop {Parser} parser The parser used to parse arguments.
 */
class Handler {
  /**
   * @param {Registry} registry The registry used to handle the commands.
   */
  constructor(registry) {
    this.registry = registry;
    this.parser = new Parser(registry);
  }

  /**
   * @param {Message} message The received message.
   * @param {String} prefix The prefix to use when handling the command.
   * @returns {Promise<Result>} The result of the command execution.
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

    command.trigger = commandName;

    const inGuild = message.guild !== null;

    if (command.guildOnly && !inGuild) {
      return new Result({ success: false, commandError: CommandError.GuildOnly, errorReason: 'This command may only be used inside a server.' });
    }

    if (inGuild && command.userPermissions.length > 0 && !message.guild.member(message.author).hasPermission(command.userPermissions)) {
      return new Result({ success: false, command: command, commandError: CommandError.UserPermission, errorReason: 'This command may only be used by users with the ' + PermissionUtil.format(command.userPermissions) + ' permission' + (command.userPermissions.length > 1 ? 's' : '') + '.' });
    }

    if (inGuild && command.botPermissions.length > 0 && !message.guild.me.hasPermission(command.botPermissions)) {
      return new Result({ success: false, command: command, commandError: CommandError.BotPermission, errorReason: message.client.user.username + ' cannot execute this command without the ' + PermissionUtil.format(command.botPermissions) + ' permission' + (command.botPermissions.length > 1 ? 's' : '') + '.' });
    }

    for (const precondition of command.group.preconditions.concat(command.preconditions)) {
      try {
        const result = await precondition.run(command, message);

        if (!result.success) {
          return result;
        }
      } catch (err) {
        return ExceptionResult.fromError(command, err);
      }
    }

    if (command.hasCooldown) {
      const cooldown = command.cooldown.get(message.author.id + (message.guild !== null ? message.guild.id : ''));

      if (cooldown !== undefined) {
        const difference = cooldown - Date.now();

        if (difference >= 0) {
          return CooldownResult.fromError(command, command.cooldown, difference);
        }
      }
    }

    const args = {};

    for (let i = 0; i < command.args.length; i++) {
      let value = [];

      if (command.args[i].infinite) {
        const noArgsLeft = split.length === 0;

        if (noArgsLeft && command.args[i].optional) {
          value = [this.parser.defaultValue(command.args[i], message)];
        } else if (noArgsLeft && !command.args[i].optional) {
          return new Result({ success: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
        } else {
          for (const input of split) {
            const result = command.args[i].type.read(command, message, command.args[i], input.replace(regexes.quotes, ''));

            if (!result.success) {
              return result;
            }

            value.push(result.value);
          }
        }
      } else {
        const input = command.args[i].remainder ? split.join(' ') : split.shift();

        const result = await this.parser.parseArgument(command, message, command.args[i], input);

        if (!result.success) {
          return result;
        }

        value = result.value;
      }

      for (const precondition of command.args[i].preconditions) {
        try {
          const preconditionResult = await precondition.run(command, message, command.args[i], value);

          if (!preconditionResult.success) {
            return preconditionResult;
          }
        } catch (err) {
          return ExceptionResult.fromError(command, err);
        }
      }

      args[command.args[i].key] = value;
    }

    try {
      await command.run(message, args);

      if (command.hasCooldown) {
        command.cooldown.set(message.author.id + (inGuild ? message.guild.id : ''), Date.now() + command.cooldown);
      }

      return new Result({ success: true, command: command });
    } catch (err) {
      return ExceptionResult.fromError(command, err);
    }
  }
}

module.exports = Handler;
