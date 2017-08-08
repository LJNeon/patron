const TypeReaderResult = require('../results/TypeReaderResult.js');
const constants = require('./Constants.js');

class TypeReaderUtil {
  static formatMatches(array, prop = 'name', member = false) {
    let formatted = '';

    for (let i = 0; i < array.length; i++) {
      if (i !== 0 && i === array.length - 1) {
        formatted += 'and ';
      }

      formatted += member === true ? array[i].user.tag : array[i][prop];

      if (i !== array.length - 1) {
        formatted += ', ';
      }
    }

    return formatted;
  }

  static handleMatches(command, matches, type, prop = 'name', member = false) {
    if (matches.length > constants.config.maxMatches) {
      return TypeReaderResult.fromError(command, constants.errors.tooManyMatches);
    } else if (matches.length > 1) {
      return TypeReaderResult.fromError(command, constants.errors.multipleMatches(this.formatMatches(matches, prop, member)));
    } else if (matches.length === 1) {
      return TypeReaderResult.fromSuccess(matches[0]);
    }

    return TypeReaderResult.fromError(command, constants.errors[type]);
  }
}

module.exports = TypeReaderUtil;
