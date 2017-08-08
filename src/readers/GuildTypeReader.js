const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class GuildTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guild' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.id.test(input) === true) {
      const guild = message.client.guilds.get(input);

      if (guild !== undefined) {
        return TypeReaderResult.fromSuccess(guild);
      }

      return TypeReaderResult.fromError(command, constants.errors.guildNotFound);
    }

    const lowerInput = input.toLowerCase();

    const matches = message.client.guilds.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    if (matches.length > constants.config.maxMatches) {
      return TypeReaderResult.fromError(command, constants.errors.tooManyMatches);
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, constants.errors.multipleMatches(TypeReaderUtil.formatArray(matches)));
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, constants.errors.guildNotFound);
  }
}

module.exports = new GuildTypeReader();
