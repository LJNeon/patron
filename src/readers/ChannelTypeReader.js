const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const Constants = require('../utility/Constants.js');

class ChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'channel' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const channel = message.client.channels.get(input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, Constants.errors.channelNotFound);
  }
}

module.exports = new ChannelTypeReader();
