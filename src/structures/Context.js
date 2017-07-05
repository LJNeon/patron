class Context {
  constructor(message) {
    this.message = message;
    this.guild = message.guild;
    this.channel = message.channel;
    this.author = message.author;
    this.client = message.client;
  }
}

module.exports = Context;