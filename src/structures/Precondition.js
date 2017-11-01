/**
 * A command precondition.
 */
class Precondition {
  /**
   * Executes the precondition.
   * @param {Command} command The command being executed.
   * @param {Message} message The received message.
   * @param {*} custom The custom parameters passed into the handler.
   * @abstract
   * @returns {Promise<PreconditionResult>} The result of the precondition.
   */
  async run(command, message, custom) {
    throw new Error(this.constructor.name + ' has no run method.');
  }
}

module.exports = Precondition;
