import TypeReader from '../structures/TypeReader.js';
import TypeReaderResult from '../results/TypeReaderResult.js';
import TypeReaderUtil from '../utility/TypeReaderUtil.js';
import regexes from '../constants/regexes.js';
import config from '../constants/config.json';

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

export default new RoleTypeReader();
