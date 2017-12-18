const DiscordChannelTypes = require('../../enums/DiscordChannelTypes.js');
const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategories = require('../../enums/TypeReaderCategories.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class VoiceChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'voicechannel' });

    this.category = TypeReaderCategories.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const channel = message.channel.guild.channels.get(input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === DiscordChannelTypes.VoiceChannel) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message.channel.guild.channels.filter((v) => v.name.toLowerCase().includes(lowerInput) && v.type === DiscordChannelTypes.VoiceChannel);

    return TypeReaderUtil.handleMatches(command, matches, 'voiceChannelNotFound');
  }
}

module.exports = new VoiceChannelTypeReader();
