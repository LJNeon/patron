const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class EmojiTypeReader extends TypeReader {
  constructor() {
    super({ type: 'emoji' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.emoji.test(input) === true || Constants.regexes.id.test(input) === true) {
      const emoji = message.client.emojis.get(input.match(Constants.regexes.findId)[0]);

      if (emoji !== undefined) {
        return TypeReaderResult.fromSuccess(emoji);
      }

      return TypeReaderResult.fromError(command, Constants.errors.emojiNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.client.emojis.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'emojiNotFound');
  }
}

module.exports = new EmojiTypeReader();
