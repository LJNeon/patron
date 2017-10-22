const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const Constants = require('../utility/Constants.js');

class VoiceChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'voicechannel' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const channel = message.channel.guild.channels.get(input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === 1) { // eslint-disable-line no-magic-numbers
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message.channel.guild.channels.filter((v) => v.name.toLowerCase().includes(lowerInput) && v.type === 1); // eslint-disable-line no-magic-numbers

    return TypeReaderUtil.handleMatches(command, matches, 'voiceChannelNotFound');
  }
}

module.exports = new VoiceChannelTypeReader();
