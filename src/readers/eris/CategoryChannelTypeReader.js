const DiscordChannelType = require('../../enums/DiscordChannelType.js');
const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');
let warningEmitted = false;

class CategoryChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'categorychannel' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (warningEmitted === false && (message._client.options.firstShardID !== 0 || message._client.options.lastShardID !== message._client.options.maxShards - 1)) {
      process.emitWarning('The category channel type reader is unreliable when shards are split between multiple clients.');
      warningEmitted = true;
    }

    if (Constants.regexes.id.test(input) === true) {
      const channel = message._client.channels.find((c) => c.id === input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === DiscordChannelType.CategoryChannel) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, Constants.errors.dmChannelNotFound);
  }
}

module.exports = new CategoryChannelTypeReader();
