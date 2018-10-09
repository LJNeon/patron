const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class CategoryChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'categorychannel' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.textChannelMention.test(input) === true || Constants.regexes.id.test(input) === true) {
      const channel = message.guild.channels.get(input.match(Constants.regexes.findId)[0]);

      if (channel != null && channel.type === 'category') {
        return TypeReaderResult.fromSuccess(channel);
      }

      return TypeReaderResult.fromError(command, Constants.errors.categoryChannelNotFound);
    }

    const lowerInput = input.toLowerCase();

    const matches = message.guild.channels.filterValues((v) => v.name.toLowerCase().includes(lowerInput) && v.type === 'category');

    return TypeReaderUtil.handleMatches(command, matches, 'categoryChannelNotFound');
  }
}

module.exports = new CategoryChannelTypeReader();
