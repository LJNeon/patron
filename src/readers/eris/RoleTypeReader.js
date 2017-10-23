const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const Constants = require('../utility/Constants.js');

class RoleTypeReader extends TypeReader {
  constructor() {
    super({ type: 'role' });
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.roleMention.test(input) === true || Constants.regexes.id.test(input) === true) {
      const role = message.channel.guild.roles.get(input.match(Constants.regexes.findId)[0]);

      if (role !== undefined) {
        return TypeReaderResult.fromSuccess(role);
      }

      return TypeReaderResult.fromError(command, Constants.errors.roleNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.channel.guild.roles.filter((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'roleNotFound');
  }
}

module.exports = new RoleTypeReader();
