class Precondition {
	async run(command, context, args) {
		throw new Error(this.constructor.name + ' has no run method.');
	}
}

module.exports = Precondition;