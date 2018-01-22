const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class EmojiTypeReader extends TypeReader {
  constructor() {
    super({ type: 'emoji' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.emoji.test(input) === true || Constants.regexes.id.test(input) === true) {
      const emoji = message._client.emojis.find((e) => e.id === input.match(Constants.regexes.findId)[0]);

      if (emoji !== undefined) {
        return TypeReaderResult.fromSuccess(emoji);
      }

      return TypeReaderResult.fromError(command, Constants.errors.emojiNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message._client.emojis.filter((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'emojiNotFound');
  }
}

module.exports = new EmojiTypeReader();
