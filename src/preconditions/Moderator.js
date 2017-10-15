const Precondition = require('../structures/Precondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class Moderator extends Precondition {
  async run(command, msg) {
    if (msg.member.hasPermission('MANAGE_MESSAGES') === true) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'Only a moderator may use this command.');
  }
}

module.exports = new Moderator();
