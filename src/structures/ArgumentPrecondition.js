/**
 * An argument precondition.
 */
class ArgumentPrecondition {
  /**
   * Executes the argument precondition.
   * @param {Command} command The command being run.
   * @param {Message} message The received message.
   * @param {Argument} argument The argument in question.
   * @param {object} args The currently resolved arguments.
   * @param {*} value The value of the argument.
   * @abstract
   * @returns {Promise<PreconditionResult>} The result of the argument precondition.
   */
  async run(command, message, argument, args, value) {
    throw new Error(this.constructor.name + ' has no run method.');
  }
}

module.exports = ArgumentPrecondition;
