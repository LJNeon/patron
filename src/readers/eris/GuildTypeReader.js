const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');
let warningEmitted = false;

class GuildTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guild' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (warningEmitted === false && (message._client.options.firstShardID !== 0 || message._client.options.lastShardID !== message._client.options.maxShards - 1)) {
      process.emitWarning('The guild type reader is unreliable when shards are split between multiple clients.');
      warningEmitted = true;
    }

    if (Constants.regexes.id.test(input) === true) {
      const guild = message._client.guilds.get(input.match(Constants.regexes.findId)[0]);

      if (guild !== undefined) {
        return TypeReaderResult.fromSuccess(guild);
      }

      return TypeReaderResult.fromError(command, Constants.errors.guildNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message._client.guilds.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'guildNotFound');
  }
}

module.exports = new GuildTypeReader();
