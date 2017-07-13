const discord = require('discord.js');
const Precondition = require('./Precondition.js');

class Group {
  constructor(options) {
    this.name = options.name;
    this.description = options.description !== undefined ? options.description : '';
    this.preconditions = options.preconditions !== undefined ? options.preconditions : [];
    this.commands = new discord.Collection();

    this.constructor.validateGroup(this, this.constructor.name);
  }

  static validateGroup(group, name) {
    if (typeof group.name !== 'string' || group.name !== group.name.toLowerCase()) {
      throw new TypeError(name + ': All group names must be a lowercase string.');
    } else if (typeof group.description !== 'string') {
      throw new TypeError(name + ': All group descriptions must be a string.');
    }

    for (const precondition of group.preconditions) {
      if (typeof precondition !== 'object') {
        throw new TypeError(name + ': All precondition exports must be an instance of the precondition.');
      } else if (!(precondition instanceof Precondition)) {
        throw new TypeError(name + ': All group preconditions must inherit the Precondition class.');
      }
    }
  }
}

module.exports = Group;
