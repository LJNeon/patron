class TypeReaderUtil {
  static formatArray(array, prop = 'name', prop2 = null) {
    let formatted = '';

    for (let i = 0; i < array.length; i++) {
      if (i !== 0 && i === array.length - 1) {
        formatted += 'and ';
      }

      formatted += prop2 !== null ? array[i][prop][prop2] : array[i][prop];

      if (i !== array.length - 1) {
        formatted += ', ';
      }
    }

    return formatted;
  }
}

module.exports = TypeReaderUtil;
