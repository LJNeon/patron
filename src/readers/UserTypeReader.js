import TypeReader from '../structures/TypeReader.js';
import TypeReaderResult from '../results/TypeReaderResult.js';
import TypeReaderUtil from '../utility/TypeReaderUtil.js';
import regexes from '../constants/regexes.js';
import config from '../constants/config.json';

class UserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'user' });
  }

  async read(command, message, arg, input) {
    if (message.client.options.fetchAllMembers) {
      if (regexes.userMention.test(input)) {
        return this.constructor.getUserResult(command, message, input.replace(regexes.parseId, ''));
      } else if (regexes.id.test(input)) {
        return this.constructor.getUserResult(command, message, input);
      }
    } else if (regexes.userMention.test(input)) {
      return this.constructor.fetchUserResult(command, message, input.replace(regexes.parseId, ''));
    } else if (regexes.id.test(input)) {
      return this.constructor.fetchUserResult(command, message, input);
    }

    const lowerInput = input.toLowerCase();

    if (regexes.usernameAndDiscrim.test(input)) {
      const user = message.client.users.find((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== null) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, 'User not found.');
    }

    let matches = [];

    if (message.guild !== null) {
      const memberMatches = message.guild.members.filterArray((v) => {
        return v.nickname !== null && v.nickname.toLowerCase().includes(lowerInput);
      });

      for (const member of memberMatches) {
        matches.push(member.user);
      }
    }

    matches = matches.concat(message.client.users.filterArray((v) => v.username.toLowerCase().includes(lowerInput)));

    if (matches.length > config.maxMatches) {
      return TypeReaderResult.fromError(command, 'Multiple matches found, please be more specific.');
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, 'Multiple matches found: ' + TypeReaderUtil.formatUsers(matches) + '.');
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, 'User not found.');
  }

  static async fetchUserResult(command, message, input) {
    try {
      const user = await message.client.fetchUser(input);

      return TypeReaderResult.fromSuccess(user);
    } catch (err) {
      return TypeReaderResult.fromError(command, 'User not found.');
    }
  }

  static getUserResult(command, message, input) {
    const user = message.client.users.get(input);

    if (user !== undefined) {
      return TypeReaderResult.fromSuccess(user);
    }

    return TypeReaderResult.fromError(command, 'User not found.');
  }
}

export default new UserTypeReader();
