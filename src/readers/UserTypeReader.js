const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const regexes = require('../Constants/regexes.js');
const config = require('../constants/config.json');

class UserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'user' });
  }

  async read(command, msg, arg, input) {
    if (msg.client.options.fetchAllMembers) { 
      if (regexes.userMention.test(input)) {
        return this.constructor.getUserResult(command, msg, input.replace(regexes.parseUserId, ''));
      } else if (regexes.id.test(input)) {
        return this.constructor.getUserResult(command, msg, input);
      }
    } else {
      if (regexes.userMention.test(input)) {
        return this.constructor.fetchUserResult(command, msg, input.replace(regexes.parseUserId, ''));
      } else if (regexes.id.test(input)) {
        return this.constructor.fetchUserResult(command, msg, input);
      }
    }

    const lowerInput = input.toLowerCase();

    if (regexes.usernameAndDiscrim.test(input)) {
      const user = msg.client.users.find((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== null) {
        return TypeReaderResult.fromSuccess(user);
      } else {
        return TypeReaderResult.fromError(command, 'User not found.');
      }
    }

    let matches = [];

    if (msg.guild !== null) {
      const memberMatches = msg.guild.members.filterArray((v) => {
        return v.nickname !== null && v.nickname.toLowerCase().includes(lowerInput);
      });

      for (const member of memberMatches) {
        matches.push(member.user);
      }
    }

    matches = matches.concat(msg.client.users.filterArray((v) => v.username.toLowerCase().includes(lowerInput)));

    if (matches.length > config.maxMatches) {
      return TypeReader.fromError(command, 'Multiple matches found, please be more specific.');
    } else if (matches.length > 1) {
      return TypeReader.fromError(command, 'Multiple matches found: ' + TypeReaderUtil.formatUsers(matches) + '.');
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, 'User not found.');
  }

  static async fetchUserResult(command, msg, input) {
    try {
      const user = await msg.client.fetchUser(input);

      return TypeReaderResult.fromSuccess(user);
    } catch (err) {
      return TypeReaderResult.fromError(command, 'User not found.');
    }
  }

  static getUserResult(command, msg, input) {
    const user = msg.client.users.get(input);

    if (user !== undefined) {
      return TypeReaderResult.fromSuccess(user);
    } else {
      return TypeReaderResult.fromError(command, 'User not found.');
    }
  }
}

module.exports = new UserTypeReader();
