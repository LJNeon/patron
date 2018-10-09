const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');
let warningEmitted = false;

class ChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'channel' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (warningEmitted === false && message.client.shard != null) {
      process.emitWarning('The channel type reader is unreliable when shards are split between multiple clients.');
      warningEmitted = true;
    }

    if (Constants.regexes.id.test(input) === true) {
      const channel = message.client.channels.get(input.match(Constants.regexes.findId)[0]);

      if (channel != null) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, Constants.errors.channelNotFound);
  }
}

module.exports = new ChannelTypeReader();
