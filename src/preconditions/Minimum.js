const ArgumentPrecondition = require('../structures/ArgumentPrecondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class Minimum extends ArgumentPrecondition {
  constructor(minimum) {
    super();
    this.minimum = minimum;
  }

  async run(command, msg, argument, args, value) {
    if (value >= this.minimum) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'The minimum ' + argument.name + ' is ' + this.minimum + '.');
  }
}

module.exports = Minimum;
