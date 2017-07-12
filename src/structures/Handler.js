const Parser = require('./Parser.js');
const Result = require('../results/Result.js');
const CommandError = require('../enums/CommandError.js');
const CooldownResult = require('../results/CooldownResult.js');
const ExceptionResult = require('../results/ExceptionResult.js');
const PermissionUtil = require('../utility/PermissionUtil.js');
const regexes = require('../constants/regexes.js');

class Handler {
  constructor(registry) {
    this.registry = registry;
    this.parser = new Parser(registry);
  }
	
  async run(msg, prefix) {
    const split = msg.content.match(regexes.argument);
		
    if (split === null) {
      return new Result({ isSuccess: false, commandError: CommandError.CommandNotFound, errorReason: 'This command does not exist.' });
    }
		
    const commandName = split.shift().slice(prefix.length).toLowerCase();
		
    let command = this.registry.commands.get(commandName);
		
    if (command === undefined) {
      const matches = this.registry.commands.filterArray((value) => value.aliases.some((v) => v === commandName));
			
      if (matches.length > 0) {
        command = matches[0];
      } else {
        return new Result({ isSuccess: false, commandError: CommandError.CommandNotFound, errorReason: 'This command does not exist.' });
      }
    }
		
    command.trigger = commandName;

    const inGuild = msg.guild !== null;

    if (command.guildOnly && !inGuild) {
      return new Result({ isSuccess: false, commandError: CommandError.GuildOnly, errorReason: 'This command may only be used inside a server.' });
    }

    if (command.userPermissions.length > 0 && !msg.guild.member(msg.author).hasPermission(command.userPermissions)) {
      return new Result({ isSuccess: false, command: command, commandError: CommandError.UserPermission, errorReason: 'This command may only be used by users with the ' + PermissionUtil.format(command.userPermissions) + ' permission' + (command.userPermissions.length > 1 ? 's' : '') + '.' });
    }

    if (command.botPermissions.length > 0 && !msg.guild.me.hasPermission(command.botPermissions)) {
      return new Result({ isSuccess: false, command: command, commandError: CommandError.BotPermission, errorReason: msg.client.user.username + ' cannot execute this command without the ' + PermissionUtil.format(command.botPermissions) + ' permission' + (command.botPermissions.length > 1 ? 's' : '') + '.' });
    }

    for (const precondition of command.group.preconditions.concat(command.preconditions)) {
      try {
        const result = await precondition.run(command, msg);
      
        if (!result.isSuccess) {
          return result;
        }
      } catch (err) {
        return ExceptionResult.fromError(command, err);
      }
    }

    if (command.hasCooldown) {
      const cooldown = command._cooldowns.get(msg.author.id + (msg.guild !== null ? msg.guild.id : ''));

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

        if (noArgsLeft && command.args[i].isOptional) {
          value = [this.parser.defaultValue(command.args[i], msg)];
        } else if (noArgsLeft && !command.args[i].isOptional) {
          return new Result({ isSuccess: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
        } else {
          for (const input of split) {
            const result = await this.parser.parseArgument(command, command.args[i], msg, input);

            if (!result.isSuccess) {
              return result;
            }

            value.push(result.value);
          }
        }
      } else {
        let input = command.args[i].remainder ? split.join(' ') : split.shift();

        const result = await this.parser.parseArgument(command, command.args[i], msg, input);

        if (!result.isSuccess) {
          return result;
        }

        value = result.value;
      }

      for (const precondition of command.args[i].preconditions) {
        try {
          const preconditionResult = await precondition.run(command, msg, command.args[i], value);
        
          if (!preconditionResult.isSuccess) {
            return preconditionResult;
          }
        } catch (err) {
          return ExceptionResult.fromError(command, err);
        }
      }
			
      args[command.args[i].key] = value;
    }

    try {
      await command.run(msg, args);

      if (command.hasCooldown) {
        command._cooldowns.set(msg.author.id + (inGuild ? msg.guild.id : ''), Date.now() + command.cooldown);
      }

      return new Result({ isSuccess: true, command: command }); 
    } catch (err) {
      return ExceptionResult.fromError(command, err);
    }
  }
}

module.exports = Handler;
