const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');

class UserTypeReader extends TypeReader {
	constructor() {
		super({ type: 'user' });
	}

	async read(command, context, arg, input) {
		if (/^<@!?[0-9]+>$/.test(input)) {
			try {
				const user = await context.client.fetchUser(input.replace(/<@|!|>/g, ''), false);
				return TypeReaderResult.fromSuccess(user);
			} catch (err) {
				return TypeReaderResult.fromError(command, 'User not found.');
			}
		} else if (Number.isInteger(input)) {
			try {
				const user = await context.client.fetchUser(input, false);
				return TypeReaderResult.fromSuccess(user);
			} catch (err) {
				return TypeReaderResult.fromError(command, 'User not found.');
			}
		} else if (context.guild !== null) {
			if (/^.+#\d{4}$/.test(input)) {
				await context.guild.fetchMembers(input.replace(/#\d{4}/, ''), 50);

				const lowerInput = input.toLowerCase();

				const member = context.guild.find((v) => v.user.tag.toLowerCase() === lowerInput);

				if (member !== undefined) {
					return TypeReaderResult.fromSuccess(member.user);
				} else {
					return TypeReaderResult.fromError(command, 'User not found.');
				}
			}

			await context.guild.fetchMembers(input, 50);

			const lowerInput = input.toLowerCase();

			let member = context.guild.members.find((v) => v.user.username.toLowerCase() === lowerInput);

			if (member !== undefined) {
				return TypeReaderResult.fromSuccess(member.user);
			}

			member = context.guild.members.find((v) => v.user.username.toLowerCase().includes(lowerInput));

			if (member !== undefined) {
				return TypeReaderResult.fromSuccess(member.user);
			}
		}
		
		return TypeReaderResult.fromError(command, 'User not found.');
	}
}

module.exports = new UserTypeReader();
