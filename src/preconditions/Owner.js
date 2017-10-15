const Precondition = require('../structures/Precondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class Owner extends Precondition {
  async run(command, msg) {
    if (msg.guild.ownerID === msg.author.id) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'Only the server owner may use this command.');
  }
}

module.exports = new Owner();
