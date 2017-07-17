/**
 * A command precondition.
 */
class Precondition {
  /**
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @returns {Promise<PreconditionResult>} The result of the precondition.
   */
  async run(command, message) {
    throw new Error(this.constructor.name + ' has no run method.');
  }
}

module.exports = Precondition;
