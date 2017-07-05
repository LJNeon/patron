const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class MemberTypeReader extends TypeReader {
	constructor() {
		super({ type: 'member' });
	}

	async read(command, context, arg, input) {
		if (/^<@!?[0-9]+>$/.test(input)) {
			try {
				const member = await context.guild.fetchMember(input.replace(/<@|!|>/g, ''), false);
				return TypeReaderResult.fromSuccess(member);
			} catch (err) {
				return TypeReaderResult.fromError(command, 'Member not found.');
			}
		} else if (Number.isInteger(input)) {
			try {
				const member = await context.guild.fetchMember(input, false);
				return TypeReaderResult.fromSuccess(member);
			} catch (err) {
				return TypeReaderResult.fromError(command, 'Member not found.');
			}
		} else if (/^.+#\d{4}$/.test(input)) {
			await context.guild.fetchMembers(input.replace(/#\d{4}/, ''), 50);

			const lowerInput = input.toLowerCase();

			const member = context.guild.find((v) => v.user.tag.toLowerCase() === lowerInput);

			if (member !== undefined) {
				return TypeReaderResult.fromSuccess(member);
			} else {
				return TypeReaderResult.fromError(command, 'Member not found.');
			}
		}

		await context.guild.fetchMembers(input, 50);

		const lowerInput = input.toLowerCase();

		let member = context.guild.members.find((v) => v.user.username.toLowerCase() === lowerInput);

		if (member !== undefined) {
			return TypeReaderResult.fromSuccess(member);
		}

		member = context.guild.members.find((v) => v.user.username.toLowerCase().includes(lowerInput));

		if (member !== undefined) {
			return TypeReaderResult.fromSuccess(member);
		}

		return TypeReaderResult.fromError(command, 'Member not found.');
	}
}

module.exports = new MemberTypeReader();
