class Precondition {
  async run(command, msg) {
    throw new Error(this.constructor.name + ' has no run method.');
  }
}

module.exports = Precondition;
