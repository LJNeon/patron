class ArgumentPrecondition {
  async run(command, context, argument, value) {
    throw new Error(this.constructor.name + ' has no run method.');
  }
}

module.exports = ArgumentPrecondition;
