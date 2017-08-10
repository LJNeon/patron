const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class RoleTypeReader extends TypeReader {
  constructor() {
    super({ type: 'role' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.roleMention.test(input) === true || constants.regexes.id.test(input) === true) {
      const role = message.guild.roles.get(input.match(constants.regexes.findId)[0]);

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }

      return TypeReaderResult.fromError(command, constants.errors.roleNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.guild.roles.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'roleNotFound');
  }
}

module.exports = new RoleTypeReader();
