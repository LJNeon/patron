const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class RoleTypeReader extends TypeReader {
  constructor() {
    super({ type: 'role' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.roleMention.test(input) || Constants.regexes.id.test(input)) {
      const role = message.guild.roles.get(input.match(Constants.regexes.findId)[0]);

      if (role != null) {
        return TypeReaderResult.fromSuccess(role);
      }

      return TypeReaderResult.fromError(command, Constants.errors.roleNotFound);
    }

    const lowerInput = input.toLowerCase();
    const matches = message.guild.roles.filterValues((v) => v.name.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'roleNotFound');
  }
}

module.exports = new RoleTypeReader();
