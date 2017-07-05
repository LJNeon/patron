const Result = require('../results/Result.js');
const CommandError = require('../enums/CommandError.js');
const ExceptionResult = require('../results/ExceptionResult.js');

class Handler {
  constructor(registry) {
    this.registry= registry;
  }
	
  async run(context, prefix) {
    const split = this.context.message.content.match(/".+"|\S+/g);
		
    if (split === null || !split[0].startsWith(prefix)) {
      return new Result({ isSuccess: false, commandError: CommandError.InvalidPrefix, errorReason: 'The provided prefix is invalid.' });
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

    const args = {};
		
    for (let i = 0; i < command.args.length; i++) {
      let input = split[i];
			
      if (input === undefined && !command.args[i].isOptional) {
        return new Result({ isSuccess: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
      } else if (input === undefined && command.args[i].isOptional) {
        args[command.args[i].key] = command.args[i].default;
        continue;
      } else {
        input = input.replace(/"/g, '');
      }
			
      const typeReaderResult = await this.registry.typeReaders.get(command.args[i].type).read(command, context, command.args[i], input);
			
      if (!typeReaderResult.isSuccess) {
        return typeReaderResult;
      }
			
      for (const precondition of typeReaderResult.value.preconditions) {
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
