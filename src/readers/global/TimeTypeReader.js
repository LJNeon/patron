const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategories = require('../../enums/TypeReaderCategories.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const Constants = require('../../utility/Constants.js');

class TimeTypeReader extends TypeReader {
  constructor() {
    super({ type: 'time' });

    this.category = TypeReaderCategories.Global;
  }

  async read(command, message, argument, args, input) {
    let value = parseFloat(input);

    if (Number.isNaN(value) === false) {
      if (Constants.regexes.seconds.test(input) === true) {
        value *= Constants.conversions.secondInMs;
      } else if (Constants.regexes.minutes.test(input) === true) {
        value *= Constants.conversions.minuteInMs;
      } else if (Constants.regexes.hours.test(input) === true) {
        value *= Constants.conversions.hourInMs;
      } else if (Constants.regexes.days.test(input) === true) {
        value *= Constants.conversions.dayInMs;
      } else if (Constants.regexes.weeks.test(input) === true) {
        value *= Constants.conversions.weekInMs;
      } else if (Constants.regexes.months.test(input) === true) {
        value *= Constants.conversions.monthInMs;
      } else if (Constants.regexes.years.test(input) === true) {
        value *= Constants.conversions.yearInMs;
      } else if (Constants.regexes.decades.test(input) === true) {
        value *= Constants.conversions.decadeInMs;
      } else if (Constants.regexes.centuries.test(input) === true) {
        value *= Constants.conversions.centuryInMs;
      } else if (Constants.regexes.milliseconds.test(input) === false) {
        return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
      }

      return TypeReaderResult.fromSuccess(value);
    }

    return TypeReaderResult.fromError(command, Constants.errors.invalidArg(argument));
  }
}

module.exports = new TimeTypeReader();
