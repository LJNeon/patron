const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class MemberTypeReader extends TypeReader {
  constructor() {
    super({ type: 'member' });
  }

  async read(command, context, arg, input) {
    if (context.client.options.fetchAllMembers) { 
      if (/^<@!?[0-9]+>$/.test(input)) {
        return this.getMemberResult(command, context, input.replace(/<@|!|>/g, ''));
      } else if (/^[0-9]+$/.test(input)) {
        return this.getMemberResult(command, context, input);
      }
    } else {
      if (/^<@!?[0-9]+>$/.test(input)) {
        return this.fetchMemberResult(command, context, input.replace(/<@|!|>/g, ''));
      } else if (/^[0-9]+$/.test(input)) {
        return this.fetchMemberResult(command, context, input);
      }
    }

    const lowerInput = input.toLowerCase();

    if (/^.+#\d{4}$/.test(input)) {
      
      const member = context.guild.members.find((v) => v.user.tag.toLowerCase() === lowerInput);

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

  async fetchMemberResult(command, context, input) {
    try {
      const user = await context.client.fetchUser(input);

      const member = context.guild.member(user);

      if (member !== null) {
        return TypeReaderResult.fromSuccess(member);
      } else {
        return TypeReaderResult.fromError(command, 'Member not found.');
      }
    } catch (err) {
      return TypeReaderResult.fromError(command, 'Member not found.');
    }
  }

  getMemberResult(command, context, input) {
    const member = context.guild.members.get(input);

    if (member !== undefined) {
      return TypeReaderResult.fromSuccess(member);
    } else {
      return TypeReaderResult.fromError(command, 'Member not found.');
    }
  }
}

module.exports = new MemberTypeReader();
