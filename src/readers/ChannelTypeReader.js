const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class ChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'channel' });
  }

  async read(command, context, arg, input) {
    if (/^<#[0-9]+>$/.test(input)) {
      const channel = context.guild.channels.get(input.replace(/<#|>/g, ''));

      if (channel) {
        return TypeReaderResult.fromSuccess(channel);
      }
    } else if (/^[0-9]+$/.test(input)) {
      const channel = context.guild.channels.get(input, '');

      if (channel) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }
    // TODO: Add voice and text channel type readers, and search via channel names.

    return TypeReaderResult.fromError(command, 'You have provided an invalid ' + arg.name + '.');
  }
}

module.exports = new ChannelTypeReader();
