const StringUtil = require('./StringUtil.js');
const allCapsWordRegex = /[A-Z]+/g;

class PermissionUtil {
  static format(permission) {
    let formattedPermission = '';

    for (const word of permission.match(allCapsWordRegex)) {
      formattedPermission += StringUtil.upperFirstChar(word) + ' ';
    }

    return formattedPermission.trim();
  }
}

module.exports = PermissionUtil;
