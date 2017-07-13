const StringUtil = require('./StringUtil.js');
const regexes = require('../constants/regexes');

class PermissionUtil {
  static format(permissions) {
    let formattedPermissions = '';

    for (let i = 0; i < permissions.length; i++) {
      const lastIteration = i === permissions.length - 1;

      if (lastIteration) {
        formattedPermissions += ' and';
      }

      for (const word of permissions[i].match(regexes.permission)) {
        formattedPermissions += ' ' + StringUtil.upperFirstChar(word);
      }

      if (!lastIteration) {
        formattedPermissions += ', ';
      }
    }

    return formattedPermissions.trim();
  }
}

module.exports = PermissionUtil;
