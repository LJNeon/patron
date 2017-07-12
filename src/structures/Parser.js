const Default = require('../enums/Default.js');
const CommandError = require('../enums/CommandError.js');
const Result = require('../results/Result.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const regexes = require('../constants/regexes.js');

class Parser {
  constructor(registry) {
    this.registry = registry;
  }

  async parseArgument(command, argument, msg, input) {
    if (!input && !argument.isOptional) {
      return new Result({ isSuccess: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
    } else if (!input && argument.isOptional) {
      return TypeReaderResult.fromSuccess(this.defaultValue(argument, msg));
    }
    
    return this.registry.typeReaders.get(argument.type).read(command, msg, argument, input.replace(regexes.quotes, ''));
  }

  defaultValue(argument, msg) {
    switch (argument.default) {
      case Default.Author:
        return msg.author;
      case Default.Member:
        return msg.guild.member(msg.author);
      case Default.Channel:
        return msg.channel;
      case Default.Guild:
        return msg.guild;
      case Default.HighestRole: 
        return msg.guild.member(msg.author).highestRole;
      default:
        return argument.default;
    }
  }
}

module.exports = Parser;
