const Result = require('../results/Result.js');
const Default = require('../enums/Default.js');
const CommandError = require('../enums/CommandError.js');
const ExceptionResult = require('../results/ExceptionResult.js');

class Handler {
  constructor(registry) {
    this.registry= registry;
  }
	
  async run(context, prefix) {
    const split = context.message.content.toLowerCase().match(/".+"|\S+/g);
		
    if (split === null) {
      return new Result({ isSuccess: false, commandError: CommandError.CommandNotFound, errorReason: 'This command does not exist.' });
    }
		
    const commandName = split.shift().slice(prefix.length);
		
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

    if (command.guildOnly && context.guild === null) {
      return new Result({ isSuccess: false, commandError: CommandError.GuildOnly, errorReason: 'This command may only be used inside a server.' });
    }

    const args = {};
		
    for (let i = 0; i < command.args.length; i++) {
      let input = split[i];
			
      if (input === undefined && !command.args[i].isOptional) {
        return new Result({ isSuccess: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
      } else if (input === undefined && command.args[i].isOptional) {
        switch (command.args[i].default) {
          case Default.Author:
            args[command.args[i].key] = context.author; 
            break;
          case Default.Member:
            args[command.args[i].key] = context.guild.member(context.author); 
            break;
          case Default.Channel:
            args[command.args[i].key] = context.channel; 
            break;
          case Default.Guild:
            args[command.args[i].key] = context.role; 
            break;
          case Default.HighestRole: 
            args[command.args[i].key] = context.guild.member(context.author).highestRole;
            break;
          default:
            args[command.args[i].key] = command.args[i].default;
            break;
        }

        continue;
      } else {
        input = input.replace(/"/g, '');
      }
			
      const typeReaderResult = await this.registry.typeReaders.get(command.args[i].type).read(command, context, command.args[i], input);
			
      if (!typeReaderResult.isSuccess) {
        return typeReaderResult;
      }

      for (const precondition of command.args[i].preconditions) {
        const preconditionResult = await precondition.run(command, context, command.args[i], typeReaderResult.value);
				
        if (!preconditionResult.isSuccess) {
          return preconditionResult;
        }
      }
			
      args[command.args[i].key] = typeReaderResult.value;
    }
		
    for (const precondition of command.group.preconditions.concat(command.preconditions)) {
      const result = await precondition.run(command, context, args);
      
      if (!result.isSuccess) {
        return result;
      }
    }
		
    try {
      await command.run(context, args);
      return new Result({ isSuccess: true, command: command });
    } catch (err) {
      return ExceptionResult.fromError(command, err);
    }
  }
}

module.exports = Handler;
