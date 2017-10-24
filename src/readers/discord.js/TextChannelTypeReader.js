const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class TextChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'textchannel' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.textChannelMention.test(input) === true || Constants.regexes.id.test(input) === true) {
      const channel = message.guild.channels.get(input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === 'text') {
        return TypeReaderResult.fromSuccess(channel);
      }

      return TypeReaderResult.fromError(command, Constants.errors.textChannelNotFound);
    }

    const lowerInput = input.toLowerCase();

    const matches = message.guild.channels.filterValues((v) => v.name.toLowerCase().includes(lowerInput) && v.type === 'text');

    return TypeReaderUtil.handleMatches(command, matches, 'textChannelNotFound');
  }
}

module.exports = new TextChannelTypeReader();
