const discord = require('discord.js');
const Precondition = require('./Precondition.js');

/**
 * A command group.
 * @prop {string} name The name of the group.
 * @prop {string} description The description of the group.
 * @prop {Precondition[]} preconditions The preconditions to be run on all commands inside the group.
 * @prop {Collection<string, Command>} commands A collection of all commands inside a group mapped by their lowercase name.
 */
class Group {
  /**
   * @typedef {object} GroupOptions The group options.
   * @prop {string} name The name of the group.
   * @prop {string} description The description of the group.
   * @prop {Precondition[]} preconditions The preconditions to be run on all commands inside the group.
   */

  /**
   * @param {GroupOptions} options The group options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description !== undefined ? options.description : '';
    this.preconditions = options.preconditions !== undefined ? options.preconditions : [];
    this.commands = new discord.Collection();

    this.constructor.validateGroup(this, this.constructor.name);
  }

  /**
   * @param {Group} group The group to validate.
   * @param {string} name The name of the group.
   * @private
   */
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
