const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class UserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'user' });
  }

  async read(command, context, arg, input) {
    if (/^<@!?[0-9]+>$/.test(input)) {
      const user = context.client.users.get(input.replace(/<@|!|>/g, ''));

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      } else {
        return TypeReaderResult.fromError(command, 'User not found.');
      }
    } else if (/^[0-9]+$/.test(input)) {
      const user = context.client.users.get(input);

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      } else {
        return TypeReaderResult.fromError(command, 'User not found.');
      }
    }
    
    const lowerInput = input.toLowerCase();

    if (/^.+#\d{4}$/.test(input)) {
      const user = context.client.users.find((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== null) {
        return TypeReaderResult.fromSuccess(user);
      } else {
        return TypeReaderResult.fromError(command, 'User not found.');
      }
    }

    let user = context.client.users.find((v) => v.username.toLowerCase() === lowerInput);

    if (user !== null) {
      return TypeReaderResult.fromSuccess(user);
    }

    user = context.client.users.find((v) => v.username.toLowerCase().includes(lowerInput));

    if (user !== null) {
      return TypeReaderResult.fromSuccess(user);
    }

    return TypeReaderResult.fromError(command, 'User not found.');
  }
}

module.exports = new UserTypeReader();
