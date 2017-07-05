const Result = require('./Result.js')
const CommandError = require('../enums/CommandError.js');

class ExceptionResult extends Result {
	constructor(options) {
		super(options);

		this.stackTrace = options.stackTrace;
	}

	static fromError(command, error) {
		return new ExceptionResult({ isSuccess: false, command: command, commandError: CommandError.Exception, errorReason: error.message, stackTrace: error.stackTrace });
	}
}

module.exports = ExceptionResult;