const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class GuildChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guildchannel' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.id.test(input) === true) {
      const channel = message.guild.channels.get(input.replace(constants.regexes.parseId, ''));

      if (channel !== undefined) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message.guild.channels.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'guildChannelNotFound');
  }
}

module.exports = new GuildChannelTypeReader();
