const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');
let warningEmitted = false;

class MemberTypeReader extends TypeReader {
  constructor() {
    super({ type: 'member' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (message._client.options.getAllUsers === false && warningEmitted === false) {
      process.emitWarning('The member type reader is unreliable when getAllUsers is set to false.');
      warningEmitted = true;
    }

    if (Constants.regexes.userMention.test(input) || Constants.regexes.id.test(input)) {
      let member;

      if (message._client.options.restMode) {
        try {
          member = await message.channel.guild.getRESTMember(input.match(Constants.regexes.findId)[0]);
        } catch (err) {
        }
      } else {
        member = message.channel.guild.members.get(input.match(Constants.regexes.findId)[0]);
      }

      if (member != null) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, Constants.errors.memberNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (Constants.regexes.usernameAndDiscrim.test(input)) {
      const member = message.channel.guild.members.find((v) => v.username.toLowerCase() + '#' + v.discriminator === lowerInput);

      if (member != null) {
        return TypeReaderResult.fromSuccess(member);
      }

      return TypeReaderResult.fromError(command, Constants.errors.memberNotFound);
    }

    const matches = message.channel.guild.members.filter((v) => v.user.username.toLowerCase().includes(lowerInput) || (v.nickname != null && v.nickname.toLowerCase().includes(lowerInput)));

    return TypeReaderUtil.handleMatches(command, matches, 'memberNotFound', null, true);
  }
}

module.exports = new MemberTypeReader();
