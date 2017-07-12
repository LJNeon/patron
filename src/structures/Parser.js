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
      let value;

      switch (argument.default) {
        case Default.Author:
          value = msg.author;
          break;
        case Default.Member:
          value = msg.guild.member(msg.author);
          break;
        case Default.Channel:
          value = msg.channel;
          break;
        case Default.Guild:
          value = msg.guild;
          break;
        case Default.HighestRole: 
          value = msg.guild.member(msg.author).highestRole;
          break;
        default:
          value = argument.default;
          break;
      }
      
      return TypeReaderResult.fromSuccess(value);
    }
    
    return this.registry.typeReaders.get(argument.type).read(command, msg, argument, input.replace(regexes.quotes, ''));
  }
}

module.exports = Parser;
