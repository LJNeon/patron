const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
let warningEmitted = false;

class ChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'channel' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (warningEmitted === false && (message._client.options.firstShardID !== 0 || message._client.options.lastShardID !== message._client.options.maxShards - 1)) {
      process.emitWarning('The channel type reader is unreliable when shards are split between multiple clients.');
      warningEmitted = true;
    }

    if (Constants.regexes.id.test(input) === true) {
      let channel;
      message._client.guilds.forEach((guild) => {
        if (channel === undefined) {
          const match = guild.channels.find((c) => c.id === input.match(Constants.regexes.findId)[0]);
          if (match !== undefined) {
            channel = match;
          }
        }
      });

      if (channel !== undefined) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    const lowerInput = input.toLowerCase();
    const matches = [];
    message._client.guilds.forEach((guild) => {
      matches.push(guild.channels.filter((v) => v.name.toLowerCase().indexOf(lowerInput) !== -1));
    });

    return TypeReaderUtil.handleMatches(command, matches, 'channelNotFound');
  }
}

module.exports = new ChannelTypeReader();
