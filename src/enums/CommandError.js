/**
 * The command errors.
 * @enum {Symbol}
 * @readonly
 */

const CommandError = {
  /** A precondition failure. */
  Precondition: Symbol(),
  /** A member lacking permissions. */
  MemberPermission: Symbol(),
  /** The client lacking permissions. */
  BotPermission: Symbol(),
  /** A type reader failure. */
  TypeReader: Symbol(),
  /** An unknown command. */
  CommandNotFound: Symbol(),
  /** A command used while on cooldown. */
  Cooldown: Symbol(),
  /** An invalid amount of arguments provided. */
  InvalidArgCount: Symbol(),
  /** An exception during command execution. */
  Exception: Symbol(),
  /** An invalid context for a command. */
  InvalidContext: Symbol()
};

module.exports = CommandError;
