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
        const user = await message.client.fetchUser(input);

        return TypeReaderResult.fromSuccess(user);
      } catch (err) {
        return TypeReaderResult.fromError(command, constants.errors.userNotFound);
      }
    }

    const userRegex = new RegExp(input.replace(constants.regexes.escapeRegex, '\\$&'), 'i');

    if (constants.regexes.usernameAndDiscrim.test(input) === true) {
      const user = message.client.users.find((v) => userRegex.test(v.tag));

      if (user !== null) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, constants.errors.userNotFound);
    }

    let matches = [];

    if (message.guild !== null) {
      const memberMatches = message.guild.members.filterValues((v) => v.nickname !== null && userRegex.test(v.nickname));

      for (let i = 0; i < memberMatches.length; i++) {
        matches.push(memberMatches[i].user);
      }
    }

    matches = matches.concat(message.client.users.filterValues((v) => userRegex.test(v.username)));

    if (matches.length > constants.config.maxMatches) {
      return TypeReaderResult.fromError(command, constants.errors.tooManyMatches);
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, constants.errors.multipleMatches(TypeReaderUtil.formatArray(matches, 'tag')));
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, constants.errors.userNotFound);
  }
}

module.exports = new UserTypeReader();
