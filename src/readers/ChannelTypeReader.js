const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class ChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'channel' });
  }

  async read(command, msg, arg, input) {
    if (/^<#[0-9]+>$/.test(input)) {
      const channel = msg.guild.channels.get(input.replace(/<#|>/g, ''));

      if (channel !== undefined) {
        return TypeReaderResult.fromSuccess(channel);
      }
    } else if (/^[0-9]+$/.test(input)) {
      const channel = msg.guild.channels.get(input, '');

      if (channel !== undefined) {
        return TypeReaderResult.fromSuccess(channel);
      }
    } else {
      const lowerInput = input.toLowerCase();

      const channel = msg.guild.channels.find((v) => v.name.toLowerCase() === lowerInput);

      if (channel !== null) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, 'Channel not found.');
  }
}

module.exports = new ChannelTypeReader();
