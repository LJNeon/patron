const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategories = require('../../enums/TypeReaderCategories.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class MessageTypeReader extends TypeReader {
  constructor() {
    super({ type: 'message' });

    this.category = TypeReaderCategories.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const parsedId = input.match(Constants.regexes.findId)[0];

      let msg = message.channel.messages.get(parsedId);

      if (msg === undefined) {
        try {
          msg = await message.channel.fetchMessage(parsedId);

          return TypeReaderResult.fromSuccess(msg);
        } catch (err) {
          return TypeReaderResult.fromError(command, Constants.errors.messageNotFound);
        }
      } else {
        return TypeReaderResult.fromSuccess(msg);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message.channel.messages.filterValues((v) => v.content.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'messageNotFound', 'id');
  }
}

module.exports = new MessageTypeReader();
