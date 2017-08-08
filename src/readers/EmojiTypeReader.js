const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class EmojiTypeReader extends TypeReader {
  constructor() {
    super({ type: 'emoji' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.emoji.test(input) === true || constants.regexes.id.test(input) === true) {
      const emoji = message.client.emojis.get(input.replace(constants.regexes.parseId, ''));

      if (emoji !== undefined) {
        return TypeReaderResult.fromSuccess(emoji);
      }

      return TypeReaderResult.fromError(command, constants.errors.emojiNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.client.emojis.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'emojiNotFound');
  }
}

module.exports = new EmojiTypeReader();
