console.log(require('./enums/Default.js').Author);

module.exports = {
  Argument: require('./structures/Argument.js'),
  ArgumentPrecondition: require('./structures/ArgumentPrecondition.js'),
  Command: require('./structures/Command.js'),
  CommandError: require('./enums/CommandError.js'),
  Context: require('./structures/Context.js'),
  Default: require('./enums/Default.js'),
  ExceptionResult: require('./results/ExceptionResult.js'),
  Group: require('./structures/Group.js'),
  Handler: require('./structures/Handler.js'),
  Precondition: require('./structures/Precondition.js'),
  PreconditionResult: require('./results/PreconditionResult.js'),
  Registry: require('./structures/Registry.js'),
  Result: require('./results/Result.js'),
  TypeReader: require('./structures/TypeReader.js'),
  TypeReaderResult: require('./results/TypeReaderResult.js')
};
