/**
 * The argument defaults.
 * @prop {Symbol} Author The author of the command message.
 * @prop {Symbol} Message The command message.
 * @prop {Symbol} Member The guild member of the author of the command message.
 * @prop {Symbol} Channel The channel of the command message.
 * @prop {Symbol} Guild The guild of the command message.
 * @prop {Symbol} HighestRole The highest role of the author of the command message.
 * @enum {Symbol}
 * @readonly
 */

const ArgumentDefault = {
  Author: new Symbol(),
  Message: new Symbol(),
  Member: new Symbol(),
  Channel: new Symbol(),
  Guild: new Symbol(),
  HighestRole: new Symbol()
};

module.exports = ArgumentDefault;
