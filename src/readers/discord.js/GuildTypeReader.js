const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const Constants = require('../utility/Constants.js');

class GuildTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guild' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const guild = message._client.guilds.get(input.match(Constants.regexes.findId)[0]);

      if (guild !== undefined) {
        return TypeReaderResult.fromSuccess(guild);
      }

      return TypeReaderResult.fromError(command, Constants.errors.guildNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message._client.guilds.filter((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'guildNotFound');
  }
}

module.exports = new GuildTypeReader();
