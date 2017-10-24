const DiscordChannelTypes = require('../../enums/DiscordChannelTypes.js');
const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');

class DMChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'dmchannel' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const channel = message._client.channels.find((c) => c.id === input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === DiscordChannelTypes.DM) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, Constants.errors.dmChannelNotFound);
  }
}

module.exports = new DMChannelTypeReader();
