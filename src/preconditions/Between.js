const ArgumentPrecondition = require('../structures/ArgumentPrecondition');
const PreconditionResult = require('../results/PreconditionResult.js');

class Between extends ArgumentPrecondition {
  constructor(minimum, maximum) {
    super();
    this.minimum = minimum;
    this.maximum = maximum;
  }

  async run(command, msg, argument, args, value) {
    if (value >= this.minimum && value <= this.maximum) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'The ' + argument.name + ' must be in between ' + this.minimum + ' and ' + this.minimum + '.');
  }
}

module.exports = Between;
