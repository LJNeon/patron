class TypeReaderUtil {
  static formatMembers(members) {
    let formattedMembers = '';

    for (const member of members) {
      formattedMembers += member.user.tag + ', ';
    }

    return formattedMembers.slice(0, -2);
  }

  static formatUsers(users) {
    let formattedMembers = '';

    for (const user of users) {
      formattedMembers += user.tag + ', ';
    }

    return formattedMembers.slice(0, -2);
  }

  static formatNameable(array) {
    let formattedNameables = '';

    for (const obj of array) {
      formattedNameables += obj.name + ', ';
    }

    return formattedNameables.slice(0, -2);
  }
}

module.exports = TypeReaderUtil;
