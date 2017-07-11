const StringUtil = require('./StringUtil.js');
const wordRegex = /\S+/g;

class PermissionUtil {
  static format(permission) {
    let formattedPermission = '';

    for (const word in permission.match(wordRegex)) {
      formattedPermission += StringUtil.upperFirstChar(word) + ' ';
    }

    return formattedPermission.trim();
  }
}

module.exports = PermissionUtil;
