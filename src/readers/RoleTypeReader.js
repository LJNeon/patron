const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const regexes = require('../constants/regexes.js');
const config = require('../constants/config.json');

class RoleTypeReader extends TypeReader {
  constructor() {
    super({ type: 'role' });
  }

  async read(command, message, arg, input) {
    if (regexes.roleMention.test(input)) {
      const role = message.guild.roles.get(input.replace(regexes.parseId, ''));

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }

      return TypeReaderResult.fromError(command, 'Role not found.');
    } else if (regexes.id.test(input)) {
      const role = message.guild.roles.get(input, '');

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }

      return TypeReaderResult.fromError(command, 'Role not found.');
    }

    const lowerInput = input.toLowerCase();
    const matches = message.guild.roles.filterArray((v) => v.name.toLowerCase().includes(lowerInput));

    if (matches.length > config.maxMatches) {
      return TypeReaderResult.fromError(command, 'Multiple matches found, please be more specific.');
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, 'Multiple matches found: ' + TypeReaderUtil.formatNameables(matches) + '.');
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, 'Role not found.');
  }
}

module.exports = new RoleTypeReader();
