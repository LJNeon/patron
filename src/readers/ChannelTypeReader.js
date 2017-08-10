const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const constants = require('../utility/Constants.js');

class ChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'channel' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.id.test(input) === true) {
      const channel = message.client.channels.get(input.match(constants.regexes.findId)[0]);

      if (channel !== undefined) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, constants.errors.channelNotFound);
  }
}

module.exports = new ChannelTypeReader();
