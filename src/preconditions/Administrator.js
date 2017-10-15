const Precondition = require('../structures/Precondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class Administrator extends Precondition {
  async run(command, msg) {
    if (msg.member.hasPermission('ADMINISTRATOR') === true) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'Only an administrator may use this command.');
  }
}

module.exports = new Administrator();
