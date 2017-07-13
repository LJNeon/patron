import Default from '../enums/Default.js';
import CommandError from '../enums/CommandError.js';
import Result from '../results/Result.js';
import TypeReaderResult from '../results/TypeReaderResult.js';
import regexes from '../constants/regexes.js';

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

export default Parser;
