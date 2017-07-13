const Default = require('../enums/Default.js');
const CommandError = require('../enums/CommandError.js');
const Result = require('../results/Result.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const regexes = require('../constants/regexes.js');

class Parser {
  async parseArgument(command, message, argument, input) {
    if (!input && !argument.optional) {
      return new Result({ success: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
    } else if (!input && argument.optional) {
      return TypeReaderResult.fromSuccess(this.defaultValue(argument, message));
    }
    
    return command.type.read(command, message, argument, input.replace(regexes.quotes, ''));
  }

  defaultValue(argument, message) {
    switch (argument.default) {
      case Default.Author:
        return message.author;
      case Default.Member:
        return message.guild.member(message.author);
      case Default.Channel:
        return message.channel;
      case Default.Guild:
        return message.guild;
      case Default.HighestRole: 
        return message.guild.member(message.author).highestRole;
      default:
        return argument.default;
    }
  }
}

module.exports = Parser;
