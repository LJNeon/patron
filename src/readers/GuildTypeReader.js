const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const regexes = require('../Constants/regexes.js');
const config = require('../constants/config.json');

class GuildTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guild' });
  }

  async read(command, msg, arg, input) {
    if (regexes.id.test(input)) {
      const guild = msg.client.guilds.get(input);

      if (guild !== undefined) {
        return TypeReaderResult.fromSuccess(guild);
      } else {
        return TypeReaderResult.fromError(command, 'Guild not found.');
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = msg.client.guilds.filterArray((v) => v.name.toLowerCase().includes(lowerInput));

    if (matches.length > config.maxMatches) {
      return TypeReader.fromError(command, 'Multiple matches found, please be more specific.');
    } else if (matches.length > 1) {
      return TypeReader.fromError(command, 'Multiple matches found: ' + TypeReaderUtil.formatNameable(matches) + '.');
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, 'Guild not found.');
  }
}

module.exports = new GuildTypeReader();
