const path = require('path');

require('./extensions');

/* eslint-disable global-require */
module.exports = {
  Argument: require('./structures/Argument.js'),
  ArgumentDefault: require('./enums/ArgumentDefault.js'),
  ArgumentPrecondition: require('./structures/ArgumentPrecondition.js'),
  Command: require('./structures/Command.js'),
  CommandError: require('./enums/CommandError.js'),
  CooldownResult: require('./results/CooldownResult.js'),
  ExceptionResult: require('./results/ExceptionResult.js'),
  Group: require('./structures/Group.js'),
  Handler: require('./structures/Handler.js'),
  Precondition: require('./structures/Precondition.js'),
  preconditions: require('require-all')(path.join(__dirname, 'preconditions')),
  PreconditionResult: require('./results/PreconditionResult.js'),
  Registry: require('./structures/Registry.js'),
  Result: require('./results/Result.js'),
  TypeReader: require('./structures/TypeReader.js'),
  TypeReaderResult: require('./results/TypeReaderResult.js'),
  version: require('../package.json').version
};
