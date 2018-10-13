const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class MessageTypeReader extends TypeReader {
  constructor() {
    super({ type: 'message' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input)) {
      const parsedId = input.match(Constants.regexes.findId)[0];

      let msg = message.channel.messages.get(parsedId);

      if (msg == null) {
        try {
          msg = await message.channel.getMessage(parsedId);

          return TypeReaderResult.fromSuccess(msg);
        } catch (err) {
          return TypeReaderResult.fromError(command, Constants.errors.messageNotFound);
        }
      } else {
        return TypeReaderResult.fromSuccess(msg);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message.channel.messages.filter((v) => v.content.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'messageNotFound', 'id');
  }
}

module.exports = new MessageTypeReader();
