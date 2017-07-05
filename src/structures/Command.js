const Argument = require('./Argument.js');
const Precondition = require('./Precondition.js');

class Command {
	constructor(options) {
		this.name = options.name;
		this.aliases = options.aliases;
		this.group = options.group;
		this.description = options.description;
		this.guildOnly = options.guildOnly || true;
		this.preconditions = preconditions || [];
		this.args = options.args || [];
		this.trigger = null;

		validateCommand(this, this.constructor.name);
	}

	async run(context, args) {
		throw new Error(this.constructor.name + ' does not have a run method.');
	}

	getUsage() {
		let usage = trigger || this.name;

		for (const arg of this.args) {
			let before = "<";
			let after = ">";

			if (arg.isOptional) {
				before = "[";
				after = "]";
			}

			if (arg.type === 'role' || arg.type === 'member' || arg.type === 'user') {
				before += "@";
			}

			if (arg.type === 'textChannel') {
				before += "#";
			}

			usage += ' ' + before + arg.name + after;
		}

		return usage;
	}

	getExample() {
		let example = trigger || this.name;

		for (const arg of this.args) {
			example += ' ' + arg.example;
		}

		return example;
	}
}

module.exports = Command;

const validateCommand = function(command, name) {
	if (typeof command.name  !== 'string' || command.name === command.name.toLowerCase()) {
		throw new TypeError(name + ': The name must be a lowercase string.');
	} else if (!Array.isArray(command.aliases)) {
		throw new TypeError(name + ': The aliases must be an array.');
	} else if (typeof command.group !== 'string' || command.name === command.name.toLowerCase()) {
		throw new TypeError(name + ': The group must be a lowercase string.');
	} else if (typeof command.description !== 'string') {
		throw new TypeError(name + ': The description must be a string.');
	} else if (typeof command.guildOnly !== 'boolean') {
		throw new TypeError(name + ': The guild only option must be a boolean.');
	} else if (!Array.isArray(command.preconditions)) {
		throw new TypeError(name + ': The preconditions must be an array.');
	} else if (!Array.isArray(command.args)) {
		throw new TypeError(name + ': The arguments must be an array.');
	}

	for (const alias of command.aliases) {
		if (typeof alias !== 'string' && alias === alias.toLowerCase()) {
			throw new TypeError(name + ': All command aliases must be lowercase strings.');
		}
	}

	for (const arg of command.args) {
		if (!(arg instanceof Argument)) {
			throw new TypeError(name + ': All arguments must be instances of the Argument class.');
		} else if (arg.isRemainder && arg.name !== command.args[args.length - 1].name) {
			throw new Error(name + ': Only the last argument of a command may be the remainder.');
		} else if (command.args.filter((value) => value.name === arg.name).length > 1) {
			throw new Error(name + ': There is more than one argument by the name of ' + arg.name + '.');
		} else if (command.args.filter((value) => value.key === arg.key).length > 1) {
			throw new Error(name + ': There is more than one argument by the key of ' + arg.key + '.');
		}
	}

	for (const precondition of command.preconditions) {
		if (typeof precondition !== 'object') {
			throw new TypeError(name + ': All precondition exports must be an instance of the precondition.');
		} else if (!(precondition.prototype instanceof Precondition)) {
			throw new TypeError(name + ': All command preconditions must inherit the Precondition class.');
		}
	}
}
