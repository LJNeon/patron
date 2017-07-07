const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class UserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'user' });
  }

  async read(command, context, arg, input) {
    if (context.client.options.fetchAllMembers) { 
      if (/^<@!?[0-9]+>$/.test(input)) {
        return this.getUserResult(command, context, input.replace(/<@|!|>/g, ''));
      } else if (/^[0-9]+$/.test(input)) {
        return this.getUserResult(command, context, input);
      }
    } else {
      if (/^<@!?[0-9]+>$/.test(input)) {
        return this.fetchUserResult(command, context, input.replace(/<@|!|>/g, ''));
      } else if (/^[0-9]+$/.test(input)) {
        return this.fetchUserResult(command, context, input);
      }
    }

    if (/^.+#\d{4}$/.test(input)) {
      const user = context.client.users.find((v) => v.tag.toLowerCase() === input);

      if (user !== null) {
        return TypeReaderResult.fromSuccess(user);
      } else {
        return TypeReaderResult.fromError(command, 'User not found.');
      }
    }

    let user = context.client.users.find((v) => v.username.toLowerCase() === input);

    if (user !== null) {
      return TypeReaderResult.fromSuccess(user);
    }

    user = context.client.users.find((v) => v.username.toLowerCase().includes(input));

    if (user !== null) {
      return TypeReaderResult.fromSuccess(user);
    }

    return TypeReaderResult.fromError(command, 'User not found.');
  }

  async fetchUserResult(command, context, input) {
    try {
      const user = await context.client.fetchUser(input);

      return TypeReaderResult.fromSuccess(user);
    } catch (err) {
      return TypeReaderResult.fromError(command, 'User not found.');
    }
  }

  getUserResult(command, context, input) {
    const user = context.client.users.get(input);

    if (user !== undefined) {
      return TypeReaderResult.fromSuccess(user);
    } else {
      return TypeReaderResult.fromError(command, 'User not found.');
    }
  }
}

module.exports = new UserTypeReader();
