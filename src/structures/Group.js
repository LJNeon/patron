const discord = require('discord.js');
const Precondition = require('./Precondition.js');

class Group {
  constructor(options) {
    this.name = options.name;
    this.preconditions = options.preconditions !== undefined ?  options.preconditions : [];
    this.commands = new discord.Collection();

    validateGroup(this, this.constructor.name);
  }
}

module.exports = Group;

const validateGroup = function(group, name) {
  if (typeof group.name !== 'string' || group.name !== group.name.toLowerCase()) {
    throw new TypeError(name + ': All group names must be a lowercase string.');
  }

  for (const precondition of group.preconditions) {
    if (typeof precondition !== 'object') {
      throw new TypeError(name + ': All precondition exports must be an instance of the precondition.');
    } else if (!(precondition instanceof Precondition)) {
      throw new TypeError(name + ': All group preconditions must inherit the Precondition class.');
    }
  }
};
