const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');

class ColorTypeReader extends TypeReader {
  constructor() {
    super({ type: 'color' });

    this.category = TypeReaderCategory.Global;
  }

  async read(command, message, argument, args, value) {
    let match;

    if ((match = value.match(Constants.regexes.smallHex)) != null) {
      /* eslint-disable no-magic-numbers */
      return TypeReaderResult.fromSuccess(Number('0x' + match[0].slice(-3).split('').map((c) => c + c).join('')));
    } else if ((match = value.match(Constants.regexes.hex)) != null) {
      return TypeReaderResult.fromSuccess(Number('0x' + match[0].slice(-6)));
      /* eslint-enable no-magic-numbers */
    } else if ((match = value.match(Constants.regexes.rgb)) != null) {
      const r = Number(match[0].slice(match[0].indexOf('(') + 1, match[0].indexOf(',')));

      if (r > Constants.numbers.maxRGB) {
        return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
      }

      match[0] = match[0].slice(match[0].indexOf(',') + 1).trim();
      const g = Number(match[0].slice(0, match[0].indexOf(',')));

      if (g > Constants.numbers.maxRGB) {
        return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
      }

      const b = Number(match[0].slice(match[0].indexOf(',') + 1, match[0].indexOf(')')).trim());

      if (b > Constants.numbers.maxRGB) {
        return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
      }

      return TypeReaderResult.fromSuccess((r << Constants.conversions.rToHex) | (g << Constants.conversions.gToHex) | b);
    }
    return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
  }
}

module.exports = new ColorTypeReader();
