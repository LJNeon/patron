const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const Constants = require('../utility/Constants.js');
let warningEmitted = false;

class MemberTypeReader extends TypeReader {
  constructor() {
    super({ type: 'member' });
  }

  async read(command, message, argument, args, input) {
    if (message._client.options.getAllUsers === false && warningEmitted === false) {
      process.emitWarning('The member type reader is unreliable when getAllUsers is set to false.');
      warningEmitted = true;
    }

    if (Constants.regexes.userMention.test(input) === true || Constants.regexes.id.test(input) === true) {
      let member;

      if (message._client.options.restMode === true) {
        try {
          member = await message.channel.guild.getRESTMember(input.match(Constants.regexes.findId)[0]);
        } catch (err) {
        }
      } else {
        member = message.channel.guild.members.get(input.match(Constants.regexes.findId)[0]);
      }

      if (member !== undefined) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, Constants.errors.memberNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (Constants.regexes.usernameAndDiscrim.test(input) === true) {
      const member = message.channel.guild.members.find((v) => v.user.tag.toLowerCase() === lowerInput);

      if (member !== undefined) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, Constants.errors.memberNotFound);
    }

    const matches = message.channel.guild.members.filter((v) => v.user.username.toLowerCase().includes(lowerInput) || (v.nickname !== null && v.nickname.toLowerCase().includes(lowerInput)));

    return TypeReaderUtil.handleMatches(command, matches, 'memberNotFound', null, true);
  }
}

module.exports = new MemberTypeReader();
