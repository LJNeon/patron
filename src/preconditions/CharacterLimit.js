const ArgumentPrecondition = require('../structures/ArgumentPrecondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class CharacterLimit extends ArgumentPrecondition {
  constructor(limit) {
    super();
    this.limit = limit;
  }

  async run(command, context, argument, args, value) {
    if (this.limit >= value.length) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'The ' + argument.name + ' may not be longer than ' + this.limit + ' characters.');
  }
}

module.exports = CharacterLimit;
