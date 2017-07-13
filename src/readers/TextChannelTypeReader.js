import TypeReader from '../structures/TypeReader.js';
import TypeReaderResult from '../results/TypeReaderResult.js';
import TypeReaderUtil from '../utility/TypeReaderUtil.js';
import regexes from '../constants/regexes.js';
import config from '../constants/config.json';

class TextChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'textchannel' });
  }

  async read(command, message, arg, input) {
    if (regexes.textChannelMention.test(input)) {
      const channel = message.guild.channels.get(input.replace(regexes.parseId, ''));

      if (channel !== undefined && channel.type === 'text') {
        return TypeReaderResult.fromSuccess(channel);
      }

      return TypeReaderResult.fromError(command, 'Text channel not found.');
    } else if (regexes.id.test(input)) {
      const channel = message.guild.channels.get(input);

      if (channel !== undefined && channel.type === 'text') {
        return TypeReaderResult.fromSuccess(channel);
      }

      return TypeReaderResult.fromError(command, 'Text channel not found.');
    }

    const lowerInput = input.toLowerCase();

    const matches = message.guild.channels.filterArray((v) => v.name.toLowerCase().includes(lowerInput) && v.type === 'text');

    if (matches.length > config.maxMatches) {
      return TypeReaderResult.fromError(command, 'Multiple matches found, please be more specific.');
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, 'Multiple matches found: ' + TypeReaderUtil.formatNameables(matches) + '.');
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, 'Text channel not found.');
  }
}

export default new TextChannelTypeReader();
