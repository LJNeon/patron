const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategories = require('../../enums/TypeReaderCategories.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');

class DMChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'dmchannel' });

    this.category = TypeReaderCategories.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const channel = message.client.channels.get(input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === 'dm') {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, Constants.errors.dmChannelNotFound);
  }
}

module.exports = new DMChannelTypeReader();
