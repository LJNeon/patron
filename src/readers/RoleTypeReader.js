const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class RoleTypeReader extends TypeReader {
  constructor() {
    super({ type: 'role' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.roleMention.test(input) === true) {
      const role = message.guild.roles.get(input.replace(constants.regexes.parseId, ''));

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }

      return TypeReaderResult.fromError(command, constants.errors.roleNotFound);
    } else if (constants.regexes.id.test(input) === true) {
      const role = message.guild.roles.get(input);

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }

      return TypeReaderResult.fromError(command, constants.errors.roleNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.guild.roles.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    if (matches.length > constants.config.maxMatches) {
      return TypeReaderResult.fromError(command, constants.errors.tooManyMatches);
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, constants.errors.multipleMatches(TypeReaderUtil.formatArray(matches)));
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, constants.errors.roleNotFound);
  }
}

module.exports = new RoleTypeReader();
