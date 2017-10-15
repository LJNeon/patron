const ArgumentPrecondition = require('../structures/ArgumentPrecondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class Maximum extends ArgumentPrecondition {
  constructor(maximum) {
    super();
    this.maximum = maximum;
  }

  async run(command, msg, argument, args, value) {
    if (value <= this.maximum) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'The maximum ' + argument.name + ' is ' + this.maximum + '.');
  }
}

module.exports = Maximum;
