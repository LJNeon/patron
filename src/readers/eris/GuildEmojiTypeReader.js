const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const Constants = require('../utility/Constants.js');

class GuildEmojiTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guildemoji' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.emoji.test(input) === true || Constants.regexes.id.test(input) === true) {
      const emoji = message.channel.guild.emojis.find((e) => e.id === input.match(Constants.regexes.findId)[0]);

      if (emoji !== undefined) {
        return TypeReaderResult.fromSuccess(emoji);
      }

      return TypeReaderResult.fromError(command, Constants.errors.guildEmojiNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.channel.guild.emojis.filter((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'guildEmojiNotFound');
  }
}

module.exports = new GuildEmojiTypeReader();
