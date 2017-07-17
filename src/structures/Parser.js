const ArgumentDefault = require('../enums/ArgumentDefault.js');
const CommandError = require('../enums/CommandError.js');
const Result = require('../results/Result.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const regexes = require('../constants/regexes.js');

/**
 * An argument parser.
 */
class Parser {
  /**
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @param {Argument} argument The argument being parsed.
   * @param {string} input The input of the user.
   * @returns {Promise<Result>} The result of the argument parsing.
   */
  async parseArgument(command, message, argument, input) {
    if (!input && !argument.optional) {
      return new Result({ success: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' });
    } else if (!input && argument.optional) {
      return TypeReaderResult.fromSuccess(this.defaultValue(argument, message));
    }

    return argument.type.read(command, message, argument, input.replace(regexes.quotes, ''));
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

module.exports = Parser;
