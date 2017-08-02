const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const regexes = require('../constants/regexes.js');
const config = require('../constants/config.js');

class MemberTypeReader extends TypeReader {
  constructor() {
    super({ type: 'member' });
  }

  async read(command, message, arg, input) {
    if (message.client.options.fetchAllMembers) {
      if (regexes.userMention.test(input)) {
        return this.constructor.getMemberResult(command, message, input.replace(regexes.parseId, ''));
      } else if (regexes.id.test(input)) {
        return this.constructor.getMemberResult(command, message, input);
      }
    } else if (regexes.userMention.test(input)) {
      return this.constructor.fetchMemberResult(command, message, input.replace(regexes.parseId, ''));
    } else if (regexes.id.test(input)) {
      return this.constructor.fetchMemberResult(command, message, input);
    }

    const lowerInput = input.toLowerCase();

    if (regexes.usernameAndDiscrim.test(input)) {
      const member = message.guild.members.find((v) => v.user.tag.toLowerCase() === lowerInput);

      if (member !== null) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, 'Member not found.');
    }

    const matches = message.guild.members.filterArray((v) => {
      return v.user.username.toLowerCase().includes(lowerInput) || (v.nickname !== null && v.nickname.toLowerCase().includes(lowerInput));
    });

    if (matches.length > config.maxMatches) {
      return TypeReaderResult.fromError(command, 'Multiple matches found, please be more specific.');
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, 'Multiple matches found: ' + TypeReaderUtil.formatMembers(matches) + '.');
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, 'Member not found.');
  }

  static async fetchMemberResult(command, message, input) {
    try {
      const user = await message.client.fetchUser(input);

      const member = message.guild.member(user);

      if (member !== null) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, 'Member not found.');
    } catch (err) {
      return TypeReaderResult.fromError(command, 'Member not found.');
    }
  }

  static getMemberResult(command, message, input) {
    const member = message.guild.members.get(input);

    if (member !== undefined) {
      return TypeReaderResult.fromSuccess(member);
    }

    return TypeReaderResult.fromError(command, 'Member not found.');
  }
}

module.exports = new MemberTypeReader();
