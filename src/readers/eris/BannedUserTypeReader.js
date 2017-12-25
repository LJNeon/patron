const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategories = require('../../enums/TypeReaderCategories.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class BannedUserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'banneduser' });

    this.category = TypeReaderCategories.Library;
  }

  async read(command, message, argument, args, input) {
    const bans = await message.channel.guild.getBans();

    if (Constants.regexes.userMention.test(input) === true || Constants.regexes.id.test(input) === true) {
      const user = bans.find((u) => u.id === input.match(Constants.regexes.findId)[0]);

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, Constants.errors.bannedUserNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (Constants.regexes.usernameAndDiscrim.test(input) === true) {
      const user = bans.find((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, Constants.errors.bannedUserNotFound);
    }

    const matches = bans.filter((v) => v.username.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'bannedUserNotFound', 'tag');
  }
}

module.exports = new BannedUserTypeReader();
