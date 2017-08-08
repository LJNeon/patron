const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class VoiceTypeReader extends TypeReader {
  constructor() {
    super({ type: 'voicechannel' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.id.test(input) === true) {
      const channel = message.guild.channels.get(input);

      if (channel !== undefined && channel.type === 'voice') {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message.guild.channels.filterValues((v) => v.name.toLowerCase().includes(lowerInput) && v.type === 'voice');

    if (matches.length > constants.config.maxMatches) {
      return TypeReaderResult.fromError(command, constants.errors.tooManyMatches);
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, constants.errors.multipleMatches(TypeReaderUtil.formatArray(matches)));
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, constants.errors.voiceChannelNotFound);
  }
}

module.exports = new VoiceTypeReader();
