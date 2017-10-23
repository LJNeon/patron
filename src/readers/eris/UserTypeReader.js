const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const Constants = require('../utility/Constants.js');
let warningEmitted = false;

class UserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'user' });
  }

  async read(command, message, argument, args, input) {
    if (message._client.options.getAllUsers === false && warningEmitted === false) {
      process.emitWarning('The user type reader is unreliable when getAllUsers is set to false.');
      warningEmitted = true;
    }
    
    if (Constants.regexes.userMention.test(input) === true || Constants.regexes.id.test(input) === true) {
      let user;

      if (message._client.options.restMode === true) {
        try {
          user = await message._client.getRESTUser(input.match(Constants.regexes.findId)[0]);
        } catch (err) { /* eslint-disable no-empty */
        }
      } else {
        user = message._client.users.get(input.match(Constants.regexes.findId)[0]);
      }

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, Constants.errors.userNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (Constants.regexes.usernameAndDiscrim.test(input) === true) {
      const user = message._client.users.find((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, Constants.errors.userNotFound);
    }

    let matches = [];

    if (message.channel.guild !== undefined) {
      const memberMatches = message.channel.guild.members.filter((v) => v.nickname !== null && v.nickname.toLowerCase().includes(lowerInput));

      for (let i = 0; i < memberMatches.length; i++) {
        matches.push(memberMatches[i].user);
      }
    }

    matches = matches.concat(message._client.users.filter((v) => v.username.toLowerCase().includes(lowerInput)));

    return TypeReaderUtil.handleMatches(command, matches, 'userNotFound', 'tag');
  }
}

module.exports = new UserTypeReader();
