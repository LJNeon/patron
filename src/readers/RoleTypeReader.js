const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class RoleTypeReader extends TypeReader {
  constructor() {
    super({ type: 'role' });
  }

  async read(command, context, arg, input) {
    if (/^<@&[0-9]+>$/.test(input)) {
      const role = context.guild.roles.get(input.replace(/<@&|>/g, ''));

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }
    } else if (/^[0-9]+$/.test(input)) {
      const role = context.guild.roles.get(input, '');

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }
    } else {
      const role = context.guild.roles.find((v) => v.toLowerCase() === input);

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }
    }

    return TypeReaderResult.fromError(command, 'Role not found.');
  }
}

module.exports = new RoleTypeReader();
