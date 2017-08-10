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
      const guild = message.client.guilds.get(input.match(constants.regexes.findId)[0]);

      if (guild !== undefined) {
        return TypeReaderResult.fromSuccess(guild);
      }

      return TypeReaderResult.fromError(command, constants.errors.guildNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.client.guilds.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'guildNotFound');
  }
}

module.exports = new GuildTypeReader();
