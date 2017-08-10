const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class MemberTypeReader extends TypeReader {
  constructor() {
    super({ type: 'member' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.userMention.test(input) === true || constants.regexes.id.test(input) === true) {
      try {
        const user = await message.client.fetchUser(input.match(constants.regexes.findId)[0]);
        const member = message.guild.member(user);

        if (member !== null) {
          return TypeReaderResult.fromSuccess(member);
        }
      } catch (err) { /* eslint-disable no-empty */
      }

      return TypeReaderResult.fromError(command, constants.errors.memberNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (constants.regexes.usernameAndDiscrim.test(input) === true) {
      const member = message.guild.members.findValue((v) => v.user.tag.toLowerCase() === lowerInput);

      if (member !== null) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, constants.errors.memberNotFound);
    }

    const matches = message.guild.members.filterValues((v) => v.user.username.toLowerCase().includes(lowerInput) || (v.nickname !== null && v.nickname.toLowerCase().includes(lowerInput)));

    return TypeReaderUtil.handleMatches(command, matches, 'memberNotFound', null, true);
  }
}

module.exports = new MemberTypeReader();
