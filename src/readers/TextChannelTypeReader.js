const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const regexes = require('../Constants/regexes.js');
const config = require('../constants/config.json');

class TextChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'textchannel' });
  }

  async read(command, msg, arg, input) {
    if (regexes.textChannelMention.test(input)) {
      const channel = msg.guild.channels.get(input.replace(regexes.parseTextChannelId, ''));

      if (channel !== undefined && channel.type === 'text') {
        return TypeReaderResult.fromSuccess(channel);
      } else {
        return TypeReaderResult.fromError(command, 'Text channel not found.');
      }
    } else if (regexes.id.test(input)) {
      const channel = msg.guild.channels.get(input);

      if (channel !== undefined && channel.type === 'text') {
        return TypeReaderResult.fromSuccess(channel);
      } else {
        return TypeReaderResult.fromError(command, 'Text channel not found.');
      }
    } 

    const lowerInput = input.toLowerCase();

    const matches = msg.guild.channels.filterArray((v) => v.name.toLowerCase().includes(lowerInput) && v.type === 'text');

    if (matches.length > config.maxMatches) {
      return TypeReaderResult.fromError(command, 'Multiple matches found, please be more specific.');
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, 'Multiple matches found: ' + TypeReaderUtil.formatNameable(matches) + '.');
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, 'Text channel not found.');
  }
}

module.exports = new TextChannelTypeReader();
