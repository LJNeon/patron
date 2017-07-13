class Result {
  constructor(options) {
    this.success = options.success;
    this.command = options.command;
    this.commandError = options.commandError;
    this.errorReason = options.errorReason;
    this.error = options.error;
    this.value = options.value;
    this.cooldown = options.cooldown;
    this.remaining = options.remaining;
  }
}

module.exports = Result;
