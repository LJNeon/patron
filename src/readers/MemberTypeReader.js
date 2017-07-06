const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class MemberTypeReader extends TypeReader {
  constructor() {
    super({ type: 'member' });
  }

  async read(command, context, arg, input) {
    if (/^<@!?[0-9]+>$/.test(input)) {
      const member = context.guild.members.get(input.replace(/<@|!|>/g, ''));

      if (member !== undefined) {
        return TypeReaderResult.fromSuccess(member);
      } else {
        return TypeReaderResult.fromError(command, 'Member not found.');
      }
    } else if (/^[0-9]+$/.test(input)) {
      const member = context.guild.members.get(input);

      if (member !== undefined) {
        return TypeReaderResult.fromSuccess(member);
      } else {
        return TypeReaderResult.fromError(command, 'Member not found.');
      }
    }
    
    const lowerInput = input.toLowerCase();

    if (/^.+#\d{4}$/.test(input)) {
      const member = context.guild.find((v) => v.user.tag.toLowerCase() === lowerInput);

      if (member !== null) {
        return TypeReaderResult.fromSuccess(member);
      } else {
        return TypeReaderResult.fromError(command, 'Member not found.');
      }
    }

    let member = context.guild.members.find((v) => v.user.username.toLowerCase() === lowerInput);

    if (member !== null) {
      return TypeReaderResult.fromSuccess(member);
    }

    member = context.guild.members.find((v) => v.user.username.toLowerCase().includes(lowerInput));

    if (member !== null) {
      return TypeReaderResult.fromSuccess(member);
    }

    return TypeReaderResult.fromError(command, 'Member not found.');
  }
}

module.exports = new MemberTypeReader();
