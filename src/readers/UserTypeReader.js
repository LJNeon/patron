const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const userMentionRegex = /^<@!?[0-9]+>$/;
const idRegex = /^[0-9]+$/;
const parseIdRegex = /<@|!|>/g;
const usernameAndDiscrimRegex = /^.+#\d{4}$/;

class UserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'user' });
  }

  async read(command, msg, arg, input) {
    if (msg.client.options.fetchAllMembers) { 
      if (userMentionRegex.test(input)) {
        return this.getUserResult(command, msg, input.replace(parseIdRegex, ''));
      } else if (idRegex.test(input)) {
        return this.getUserResult(command, msg, input);
      }
    } else {
      if (userMentionRegex.test(input)) {
        return this.fetchUserResult(command, msg, input.replace(parseIdRegex, ''));
      } else if (idRegex.test(input)) {
        return this.fetchUserResult(command, msg, input);
      }
    }

    const lowerInput = input.toLowerCase();

    if (usernameAndDiscrimRegex.test(input)) {
      const user = msg.client.users.find((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== null) {
        return TypeReaderResult.fromSuccess(user);
      } else {
        return TypeReaderResult.fromError(command, 'User not found.');
      }
    }

    let user = msg.client.users.find((v) => v.username.toLowerCase() === lowerInput);

    if (user !== null) {
      return TypeReaderResult.fromSuccess(user);
    }

    user = msg.client.users.find((v) => v.username.toLowerCase().includes(lowerInput));

    if (user !== null) {
      return TypeReaderResult.fromSuccess(user);
    }

    return TypeReaderResult.fromError(command, 'User not found.');
  }

  async fetchUserResult(command, msg, input) {
    try {
      const user = await msg.client.fetchUser(input);

      return TypeReaderResult.fromSuccess(user);
    } catch (err) {
      return TypeReaderResult.fromError(command, 'User not found.');
    }
  }

  getUserResult(command, msg, input) {
    const user = msg.client.users.get(input);

    if (user !== undefined) {
      return TypeReaderResult.fromSuccess(user);
    } else {
      return TypeReaderResult.fromError(command, 'User not found.');
    }
  }
}

module.exports = new UserTypeReader();
