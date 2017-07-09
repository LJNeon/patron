const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class MemberTypeReader extends TypeReader {
  constructor() {
    super({ type: 'member' });
  }

  async read(command, msg, arg, input) {
    if (msg.client.options.fetchAllMembers) { 
      if (/^<@!?[0-9]+>$/.test(input)) {
        return this.getMemberResult(command, msg, input.replace(/<@|!|>/g, ''));
      } else if (/^[0-9]+$/.test(input)) {
        return this.getMemberResult(command, msg, input);
      }
    } else {
      if (/^<@!?[0-9]+>$/.test(input)) {
        return this.fetchMemberResult(command, msg, input.replace(/<@|!|>/g, ''));
      } else if (/^[0-9]+$/.test(input)) {
        return this.fetchMemberResult(command, msg, input);
      }
    }

    const lowerInput = input.toLowerCase();

    if (/^.+#\d{4}$/.test(input)) {
      
      const member = msg.guild.members.find((v) => v.user.tag.toLowerCase() === lowerInput);

      if (member !== null) {
        return TypeReaderResult.fromSuccess(member);
      } else {
        return TypeReaderResult.fromError(command, 'Member not found.');
      }
    }

    let member = msg.guild.members.find((v) => v.user.username.toLowerCase() === lowerInput);

    if (member !== null) {
      return TypeReaderResult.fromSuccess(member);
    }

    member = msg.guild.members.find((v) => v.user.username.toLowerCase().includes(lowerInput));

    if (member !== null) {
      return TypeReaderResult.fromSuccess(member);
    }

    return TypeReaderResult.fromError(command, 'Member not found.');
  }

  async fetchMemberResult(command, msg, input) {
    try {
      const user = await msg.client.fetchUser(input);

      const member = msg.guild.member(user);

      if (member !== null) {
        return TypeReaderResult.fromSuccess(member);
      } else {
        return TypeReaderResult.fromError(command, 'Member not found.');
      }
    } catch (err) {
      return TypeReaderResult.fromError(command, 'Member not found.');
    }
  }

  getMemberResult(command, msg, input) {
    const member = msg.guild.members.get(input);

    if (member !== undefined) {
      return TypeReaderResult.fromSuccess(member);
    } else {
      return TypeReaderResult.fromError(command, 'Member not found.');
    }
  }
}

module.exports = new MemberTypeReader();
