const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const idRegex = /^[0-9]+$/;

class GuildTypeReader extends TypeReader {
  constructor() {
    super({ type: 'guild' });
  }

  async read(command, msg, arg, input) {
    if (idRegex.test(input)) {
      const guild = msg.client.guilds.get(input);

      if (guild !== undefined) {
        return TypeReaderResult.fromSuccess(guild);
      }
    } else {
      const lowerInput = input.toLowerCase();

      const guild = msg.client.guilds.find((v) => v.name.toLowerCase() === lowerInput);

      if (guild !== null) {
        return TypeReaderResult.fromSuccess(guild);
      }
    }

    return TypeReaderResult.fromError(command, 'Guild not found.');
  }
}

module.exports = new GuildTypeReader();
