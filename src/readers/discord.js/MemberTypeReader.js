const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class MemberTypeReader extends TypeReader {
  constructor() {
    super({ type: 'member' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.userMention.test(input) || Constants.regexes.id.test(input)) {
      try {
        const user = await message.client.users.fetch(input.match(Constants.regexes.findId)[0]);
        const member = message.guild.member(user);

        if (member != null) {
          return TypeReaderResult.fromSuccess(member);
        }
      } catch (err) {
      }

      return TypeReaderResult.fromError(command, Constants.errors.memberNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (Constants.regexes.usernameAndDiscrim.test(input)) {
      const member = message.guild.members.findValue((v) => v.user.tag.toLowerCase() === lowerInput);

      if (member != null) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, Constants.errors.memberNotFound);
    }

    const matches = message.guild.members.filterValues((v) => v.user.username.toLowerCase().includes(lowerInput) || (v.nickname != null && v.nickname.toLowerCase().includes(lowerInput)));

    return TypeReaderUtil.handleMatches(command, matches, 'memberNotFound', null, true);
  }
}

module.exports = new MemberTypeReader();
