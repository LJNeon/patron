const DiscordChannelTypes = require('../../enums/DiscordChannelTypes.js');
const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategories = require('../../enums/TypeReaderCategories.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');

class CategoryChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'categorychannel' });

    this.category = TypeReaderCategories.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const channel = message._client.channels.find((c) => c.id === input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === DiscordChannelTypes.Category) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, Constants.errors.dmChannelNotFound);
  }
}

module.exports = new CategoryChannelTypeReader();
