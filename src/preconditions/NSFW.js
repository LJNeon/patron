const Precondition = require('../structures/Precondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class NSFW extends Precondition {
  async run(command, msg) {
    if (msg.channel.nsfw === true) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'This command may only be used in a NSFW channel.');
  }
}

module.exports = new NSFW();
