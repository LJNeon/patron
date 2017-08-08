class TypeReaderUtil {
  static formatArray(array, prop = 'name') {
    let formatted = '';

    for (let i = 0; i < array.length; i++) {
      if (i !== 0 && i === array.length - 1) {
        formatted += 'and ';
      }

      formatted += array[i][prop];

      if (i !== array.length - 1) {
        formatted += ', ';
      }
    }

    return formatted;
  }
}

module.exports = TypeReaderUtil;
