const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class BannedUserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'banneduser' });
  }

  async read(command, message, argument, input) {
    const bans = await message.guild.fetchBans();

    if (constants.regexes.userMention.test(input) === true || constants.regexes.id.test(input) === true) {
      const user = bans.get(input.replace(constants.regexes.parseId, ''));

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, constants.errors.bannedUserNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (constants.regexes.usernameAndDiscrim.test(input) === true) {
      const user = bans.findValue((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== null) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, constants.errors.bannedUserNotFound);
    }

    const matches = bans.filterValues((v) => v.username.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'bannedUserNotFound', 'tag');
  }
}

module.exports = new BannedUserTypeReader();
