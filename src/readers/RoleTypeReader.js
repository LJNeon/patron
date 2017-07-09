const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class RoleTypeReader extends TypeReader {
  constructor() {
    super({ type: 'role' });
  }

  async read(command, msg, arg, input) {
    if (/^<@&[0-9]+>$/.test(input)) {
      const role = msg.guild.roles.get(input.replace(/<@&|>/g, ''));

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }
    } else if (/^[0-9]+$/.test(input)) {
      const role = msg.guild.roles.get(input, '');

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }
    } else {
      const lowerInput = input.toLowerCase();
      const role = msg.guild.roles.find((v) => v.name.toLowerCase() === lowerInput);

      if (role !== null) {
        return TypeReaderResult.fromSuccess(role);
      }
    }

    return TypeReaderResult.fromError(command, 'Role not found.');
  }
}

module.exports = new RoleTypeReader();
