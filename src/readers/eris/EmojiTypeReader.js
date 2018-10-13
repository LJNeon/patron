const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');
let warningEmitted = false;

class EmojiTypeReader extends TypeReader {
  constructor() {
    super({ type: 'emoji' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (warningEmitted === false && (message._client.options.firstShardID !== 0 || message._client.options.lastShardID !== message._client.options.maxShards - 1)) {
      process.emitWarning('The emoji reader is unreliable when shards are split between multiple clients.');
      warningEmitted = true;
    }

    if (Constants.regexes.emoji.test(input) || Constants.regexes.id.test(input)) {
      let emoji;
      message._client.guilds.forEach((guild) => {
        if (emoji == null) {
          const match = guild.emojis.find((e) => e.id === input.match(Constants.regexes.findId)[0]);
          if (match != null) {
            emoji = match;
          }
        }
      });

      if (emoji != null) {
        return TypeReaderResult.fromSuccess(emoji);
      }

      return TypeReaderResult.fromError(command, Constants.errors.emojiNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = [];
    message._client.guilds.forEach((guild) => {
      matches.push(guild.emojis.filter((v) => v.name.toLowerCase().indexOf(lowerInput) !== -1));
    });

    return TypeReaderUtil.handleMatches(command, matches, 'emojiNotFound');
  }
}

module.exports = new EmojiTypeReader();
