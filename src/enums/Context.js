/**
 * The Command contexts.
 * @enum {Symbol}
 * @readonly
 */

const Context = {
  /** Usable in DMs. */
  DM: Symbol(),
  /** Usable in guilds. */
  Guild: Symbol()
};

module.exports = Context;
