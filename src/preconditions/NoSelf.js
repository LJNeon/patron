const ArgumentPrecondition = require('../structures/ArgumentPrecondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class NoSelf extends ArgumentPrecondition {
  async run(command, msg, argument, args, value) {
    if (value.id !== msg.author.id) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'You may not use this command on yourself.');
  }
}

module.exports = new NoSelf();
