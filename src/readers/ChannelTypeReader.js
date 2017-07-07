const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class ChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'channel' });
  }

  async read(command, context, arg, input) {
    if (/^<#[0-9]+>$/.test(input)) {
      const channel = context.guild.channels.get(input.replace(/<#|>/g, ''));

      if (channel !== undefined) {
        return TypeReaderResult.fromSuccess(channel);
      }
    } else if (/^[0-9]+$/.test(input)) {
      const channel = context.guild.channels.get(input, '');

      if (channel !== undefined) {
        return TypeReaderResult.fromSuccess(channel);
      }
    } else {
      const channel = context.guild.channels.find((v) => v.name.toLowerCase() === input);

      if (channel !== null) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, 'Channel not found.');
  }
}

module.exports = new ChannelTypeReader();
