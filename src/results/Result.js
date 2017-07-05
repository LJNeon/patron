class Result {
	constructor(options) {
		this.isSuccess = options.isSuccess;
		this.command = options.command;
		this.commandError = options.commandError;
		this.errorReason = options.errorReason;
	}
}

module.exports = Result;