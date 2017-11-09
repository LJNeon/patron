const Precondition = require('./Precondition.js');

/**
 * A command group.
 * @prop {string} name The name of the group.
 * @prop {string} description The description of the group.
 * @prop {Precondition[]} preconditions The preconditions to be run on all commands inside the group.
 * @prop {Command[]} commands An array of all commands inside the group.
 */
class Group {
  /**
   * @typedef {object} GroupOptions The group options.
   * @prop {string} name The name of the group.
   * @prop {string} [description=''] The description of the group.
   * @prop {Precondition[]} [preconditions=[]] The preconditions to be run on all commands inside the group.
   */

  /**
   * @param {GroupOptions} options The group options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description !== undefined ? options.description : '';
    this.preconditions = options.preconditions !== undefined ? options.preconditions : [];
    this.commands = [];
    this.preconditionOptions = [];

    this.constructor.validateGroup(this, this.constructor.name);
  }

  /**
   * Validates a group.
   * @param {Group} group The group to validate.
   * @param {string} name The name of the constructor of the group.
   * @private
   */
  static validateGroup(group, name) {
    if (typeof group.name !== 'string' || group.name !== group.name.toLowerCase()) {
      throw new TypeError(name + ': The name must be a lowercase string.');
    } else if (typeof group.description !== 'string') {
      throw new TypeError(name + ': All group descriptions must be a string.');
    }

    for (let i = 0; i < group.preconditions.length; i++) {
      if (typeof group.preconditions[i] !== 'object') {
        throw new TypeError(name + ': All precondition exports must be an instance of the precondition.');
      } else if ((group.preconditions[i] instanceof Precondition) === false) {
        throw new TypeError(name + ': All group preconditions must inherit the Precondition class.');
      }
    }
  }
}

module.exports = Group;
