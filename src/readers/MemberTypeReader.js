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
        const user = await message.client.fetchUser(input.replace(constants.regexes.parseId, ''));
        const member = message.guild.member(user);

        if (member !== null) {
          return TypeReaderResult.fromSuccess(member);
        }

        return TypeReaderResult.fromError(command, constants.errors.memberNotFound);
      } catch (err) {
        return TypeReaderResult.fromError(command, constants.errors.memberNotFound);
      }
    }

    const memberRegex = new RegExp(input.replace(constants.regexes.escapeRegex, '\\$&'), 'i');

    if (constants.regexes.usernameAndDiscrim.test(input) === true) {
      const member = message.guild.members.find((v) => memberRegex.test(v.user.tag));

      if (member !== null) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, constants.errors.memberNotFound);
    }

    const matches = message.guild.members.filterValues((v) => memberRegex.test(v.user.username) || (v.nickname !== null && memberRegex.test(v.nickname)));

    if (matches.length > constants.config.maxMatches) {
      return TypeReaderResult.fromError(command, constants.errors.tooManyMatches);
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, constants.errors.multipleMatches(TypeReaderUtil.formatArray(matches, 'user.tag')));
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, constants.errors.memberNotFound);
  }
}

module.exports = new MemberTypeReader();
