const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class VoiceChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'voicechannel' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.id.test(input) === true) {
      const channel = message.guild.channels.get(input.match(constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === 'voice') {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message.guild.channels.filterValues((v) => v.name.toLowerCase().includes(lowerInput) && v.type === 'voice');

    return TypeReaderUtil.handleMatches(command, matches, 'voiceChannelNotFound');
  }
}

module.exports = new VoiceChannelTypeReader();
