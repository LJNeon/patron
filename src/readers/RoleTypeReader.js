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
    }
    // TODO: Search via role names.

    return TypeReaderResult.fromError(command, 'You have provided an invalid ' + arg.name + '.');
  }
}

module.exports = new RoleTypeReader();