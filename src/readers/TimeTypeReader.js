const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const constants = require('../utility/Constants.js');

class TimeTypeReader extends TypeReader {
  constructor() {
    super({ type: 'time' });
  }

  async read(command, message, argument, input) {
    let value = parseFloat(input);

    if (Number.isNaN(value) === false) {
      if (constants.regexes.seconds.test(input) === true) {
        value *= constants.conversions.secondInMs;
      } else if (constants.regexes.minutes.test(input) === true) {
        value *= constants.conversions.minuteInMs;
      } else if (constants.regexes.hours.test(input) === true) {
        value *= constants.conversions.hourInMs;
      } else if (constants.regexes.days.test(input) === true) {
        value *= constants.conversions.dayInMs;
      } else if (constants.regexes.weeks.test(input) === true) {
        value *= constants.conversions.weekInMs;
      } else if (constants.regexes.months.test(input) === true) {
        value *= constants.conversions.monthInMs;
      } else if (constants.regexes.years.test(input) === true) {
        value *= constants.conversions.yearInMs;
      } else if (constants.regexes.decades.test(input) === true) {
        value *= constants.conversions.decadeInMs;
      } else if (constants.regexes.centuries.test(input) === true) {
        value *= constants.conversions.centuryInMs;
      } else if (constants.regexes.milliseconds.test(input) === false) {
        value *= constants.conversions.hourInMs;
      }

      return TypeReaderResult.fromSuccess(value);
    }

    return TypeReaderResult.fromError(command, constants.errors.invalidArg(argument));
  }
}

module.exports = new TimeTypeReader();
