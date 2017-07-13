class Precondition {
  async run(command, message) {
    throw new Error(this.constructor.name + ' has no run method.');
  }
}

export default Precondition;
