/**
 * A command group.
 * @prop {string} name The name of the group.
 * @prop {string} description The description of the group.
 * @prop {Precondition[]} preconditions The preconditions to be run on all commands inside the group.
 * @prop {object[]} preconditionOptions The options to be passed to preconditions when they're run.
 * @prop {Command[]} commands An array of all commands inside the group.
 */
class Group {
  /**
   * @typedef {object} GroupOptions The group options.
   * @prop {string} name The name of the group.
   * @prop {string} [description=''] The description of the group.
   * @prop {Array<string|object>} [preconditions=[]] The preconditions to be run on all commands inside the group.
   * @prop {Array<object>} [preconditionOptions=[]] The options to be passed to preconditions when they're run.
   */

  /**
   * @param {GroupOptions} options The group options.
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description === undefined ? '' : options.description;
    this.preconditions = options.preconditions === undefined ? [] : options.preconditions;
    this.commands = [];
    this.preconditionOptions = options.preconditionOptions === undefined ? [] : options.preconditionOptions;

    this.constructor.validateGroup(this, this.constructor.name);
  }

  /**
   * Validates a group.
   * @param {Group} group The group to validate.
   * @param {string} name The name of the constructor of the group.
   * @private
   */
  static validateGroup(group, name) {
    if (typeof group.name !== 'string') {
      throw new TypeError(name + ': The name must be a string.');
    } else if (typeof group.description !== 'string') {
      throw new TypeError(name + ': All group descriptions must be a string.');
    } else if (Array.isArray(group.preconditions) === false) {
      throw new TypeError(name + ': The preconditions must be an array.');
    } else if (Array.isArray(group.preconditionOptions) === false) {
      throw new TypeError(name + ': The precondition options must be an array.');
    }
  }
}

module.exports = Group;
