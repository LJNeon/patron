const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class GuildEmojiTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guildemoji' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.emoji.test(input) === true || constants.regexes.id.test(input) === true) {
      const emoji = message.guild.emojis.get(constants.regexes.findId.exec(input)[0]);

      if (emoji !== undefined) {
        return TypeReaderResult.fromSuccess(emoji);
      }

      return TypeReaderResult.fromError(command, constants.errors.guildEmojiNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.guild.emojis.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'guildEmojiNotFound');
  }
}

module.exports = new GuildEmojiTypeReader();
