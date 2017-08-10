const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class UserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'user' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.userMention.test(input) === true || constants.regexes.id.test(input) === true) {
      try {
        const user = await message.client.fetchUser(input.match(constants.regexes.findId)[0]);

        return TypeReaderResult.fromSuccess(user);
      } catch (err) {
        return TypeReaderResult.fromError(command, constants.errors.userNotFound);
      }
    }

    const lowerInput = input.toLowerCase();

    if (constants.regexes.usernameAndDiscrim.test(input) === true) {
      const user = message.client.users.findValue((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, constants.errors.userNotFound);
    }

    let matches = [];

    if (message.guild !== null) {
      const memberMatches = message.guild.members.filterValues((v) => v.nickname !== null && v.nickname.toLowerCase().includes(lowerInput));

      for (let i = 0; i < memberMatches.length; i++) {
        matches.push(memberMatches[i].user);
      }
    }

    matches = matches.concat(message.client.users.filterValues((v) => v.username.toLowerCase().includes(lowerInput)));

    return TypeReaderUtil.handleMatches(command, matches, 'userNotFound', 'tag');
  }
}

module.exports = new UserTypeReader();
