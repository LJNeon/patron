/**
 * The command errors.
 * @prop {Symbol} Precondition A precondition failure.
 * @prop {Symbol} MemberPermission A member lacking permissions.
 * @prop {Symbol} BotPermission The client lacking permissions.
 * @prop {Symbol} TypeReader A type reader failure.
 * @prop {Symbol} CommandNotFound An unknown command.
 * @prop {Symbol} Cooldown A command used while on cooldown.
 * @prop {Symbol} InvalidArgCount An invalid amount of arguments provided.
 * @prop {Symbol} Exception An exception during command execution.
 * @enum {Symbol}
 * @readonly
 */

const CommandError = {
  Precondition: Symbol(),
  MemberPermission: Symbol(),
  BotPermission: Symbol(),
  TypeReader: Symbol(),
  CommandNotFound: Symbol(),
  Cooldown: Symbol(),
  InvalidArgCount: Symbol(),
  Exception: Symbol()
};

module.exports = CommandError;
