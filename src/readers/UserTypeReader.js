const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class UserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'user' });
  }

  async read(command, msg, arg, input) {
    if (msg.client.options.fetchAllMembers) { 
      if (/^<@!?[0-9]+>$/.test(input)) {
        return this.getUserResult(command, msg, input.replace(/<@|!|>/g, ''));
      } else if (/^[0-9]+$/.test(input)) {
        return this.getUserResult(command, msg, input);
      }
    } else {
      if (/^<@!?[0-9]+>$/.test(input)) {
        return this.fetchUserResult(command, msg, input.replace(/<@|!|>/g, ''));
      } else if (/^[0-9]+$/.test(input)) {
        return this.fetchUserResult(command, msg, input);
      }
    }

    const lowerInput = input.toLowerCase();

    if (/^.+#\d{4}$/.test(input)) {
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
