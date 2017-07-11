const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const idRegex = /^[0-9]+$/;

class VoiceTypeReader extends TypeReader {
  constructor() {
    super({ type: 'voicechannel' });
  }

  async read(command, msg, arg, input) {
    if (idRegex.test(input)) {
      const channel = msg.guild.channels.get(input);

      if (channel !== undefined && channel.type === 'voice') {
        return TypeReaderResult.fromSuccess(channel);
      }
    } else {
      const lowerInput = input.toLowerCase();

      const channel = msg.guild.channels.find((v) => v.name.toLowerCase() === lowerInput && v.type === 'voice');

      if (channel !== null) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    return TypeReaderResult.fromError(command, 'Voice channel not found.');
  }
}

module.exports = new VoiceTypeReader();
