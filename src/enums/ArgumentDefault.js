/**
 * The argument defaults.
 * @enum {Symbol}
 * @readonly
 */

const ArgumentDefault = {
  /** The author of the command message. */
  Author: Symbol(),
  /** The command message. */
  Message: Symbol(),
  /** The guild member of the author of the command message. */
  Member: Symbol(),
  /** The channel of the command message. */
  Channel: Symbol(),
  /** The guild of the command message. */
  Guild: Symbol(),
  /** The highest role of the author of the command message. */
  HighestRole: Symbol()
};

module.exports = ArgumentDefault;
