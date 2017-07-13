import TypeReader from '../structures/TypeReader.js';
import TypeReaderResult from '../results/TypeReaderResult.js';
import TypeReaderUtil from '../utility/TypeReaderUtil.js';
import regexes from '../constants/regexes.js';
import config from '../constants/config.json';

class GuildTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guild' });
  }

  async read(command, message, arg, input) {
    if (regexes.id.test(input)) {
      const guild = message.client.guilds.get(input);

      if (guild !== undefined) {
        return TypeReaderResult.fromSuccess(guild);
      }

      return TypeReaderResult.fromError(command, 'Guild not found.');
    }

    const lowerInput = input.toLowerCase();

    const matches = message.client.guilds.filterArray((v) => v.name.toLowerCase().includes(lowerInput));

    if (matches.length > config.maxMatches) {
      return TypeReaderResult.fromError(command, 'Multiple matches found, please be more specific.');
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, 'Multiple matches found: ' + TypeReaderUtil.formatNameables(matches) + '.');
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, 'Guild not found.');
  }
}

export default new GuildTypeReader();
