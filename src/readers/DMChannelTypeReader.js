const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const constants = require('../utility/Constants.js');

class DMChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'dmchannel' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.id.test(input) === true) {
      const channel = message.client.channels.get(input.replace(constants.regexes.parseId, ''));

      if (channel !== undefined && channel.type === 'dm') {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, constants.errors.dmChannelNotFound);
  }
}

module.exports = new DMChannelTypeReader();
