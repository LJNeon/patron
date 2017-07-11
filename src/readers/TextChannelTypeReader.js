const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const textChannelMentionRegex = /^<#[0-9]+>$/;
const idRegex = /^[0-9]+$/;
const parseIdRegex = /<#|>/g;

class TextChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'textchannel' });
  }

  async read(command, msg, arg, input) {
    if (textChannelMentionRegex.test(input)) {
      const channel = msg.guild.channels.get(input.replace(parseIdRegex, ''));

      if (channel !== undefined && channel.type === 'text') {
        return TypeReaderResult.fromSuccess(channel);
      }
    } else if (idRegex.test(input)) {
      const channel = msg.guild.channels.get(input);

      if (channel !== undefined && channel.type === 'text') {
        return TypeReaderResult.fromSuccess(channel);
      }
    } else {
      const lowerInput = input.toLowerCase();

      const channel = msg.guild.channels.find((v) => v.name.toLowerCase() === lowerInput && v.type === 'text');

      if (channel !== null) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, 'Text channel not found.');
  }
}

module.exports = new TextChannelTypeReader();
