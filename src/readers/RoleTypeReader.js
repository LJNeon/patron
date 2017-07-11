const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const roleMentionRegex = /^<@&[0-9]+>$/;
const idRegex = /^[0-9]+$/;
const parseIdRegex = /<@&|>/g;

class RoleTypeReader extends TypeReader {
  constructor() {
    super({ type: 'role' });
  }

  async read(command, msg, arg, input) {
    if (roleMentionRegex.test(input)) {
      const role = msg.guild.roles.get(input.replace(parseIdRegex, ''));

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }
    } else if (idRegex.test(input)) {
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
