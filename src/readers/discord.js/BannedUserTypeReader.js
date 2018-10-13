const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class BannedUserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'banneduser' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    const bans = await message.guild.fetchBans();

    if (Constants.regexes.userMention.test(input) || Constants.regexes.id.test(input)) {
      const ban = bans.get(input.match(Constants.regexes.findId)[0]);

      if (ban != null) {
        return TypeReaderResult.fromSuccess(ban.user);
      }

      return TypeReaderResult.fromError(command, Constants.errors.bannedUserNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (Constants.regexes.usernameAndDiscrim.test(input)) {
      const ban = bans.findValue((v) => v.user.tag.toLowerCase() === lowerInput);

      if (ban != null) {
        return TypeReaderResult.fromSuccess(ban.user);
      }

      return TypeReaderResult.fromError(command, Constants.errors.bannedUserNotFound);
    }

    const matches = bans.filterValues((v) => v.user.username.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'bannedUserNotFound', 'tag', true);
  }
}

module.exports = new BannedUserTypeReader();
