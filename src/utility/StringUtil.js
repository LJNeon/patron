class StringUtil {
  static upperFirstChar(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }
}

export default StringUtil;
