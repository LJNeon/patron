const Enum = require('es6-enum');

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
const CommandError = new Enum('Precondition', 'MemberPermission', 'BotPermission', 'TypeReader', 'CommandNotFound', 'Cooldown', 'InvalidArgCount', 'Exception');

module.exports = CommandError;
