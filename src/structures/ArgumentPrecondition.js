class ArgumentPrecondition {
  async run(command, msg, argument, value) {
    throw new Error(this.constructor.name + ' has no run method.');
  }
}

module.exports = ArgumentPrecondition;
