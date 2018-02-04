/**
 * The Command contexts.
 * @enum {Symbol}
 * @readonly
 */

const Context = {
  /** Usable in DMs. */
  DM: Symbol(),
  /** Usable in guilds. */
  Guild: Symbol(),
  /** Usable in groups. */
  GroupDM: Symbol()
};

module.exports = Context;
