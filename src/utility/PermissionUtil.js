const StringUtil = require('./StringUtil.js');
const permissionRegex = /[A-Z]+/g;

class PermissionUtil {
  static format(permissions) {
    let formattedPermissions = '';

    for (let i = 0; i < permissions.length; i++) {
      const lastIteration = i === permissions.length - 1;

      if (i !== 0 && lastIteration === true) {
        formattedPermissions += ' and';
      }

      const matches = permissions[i].match(permissionRegex);

      for (let j = 0; j < matches.length; j++) {
        formattedPermissions += ' ' + StringUtil.upperFirstChar(matches[j]);
      }

      if (lastIteration === false) {
        formattedPermissions += ', ';
      }
    }

    return formattedPermissions.trim();
  }
}

module.exports = PermissionUtil;
