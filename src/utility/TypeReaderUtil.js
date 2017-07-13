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

  static formatNameables(nameables) {
    let formattedNameables = '';

    for (const obj of nameables) {
      formattedNameables += obj.name + ', ';
    }

    return formattedNameables.slice(0, -2);
  }
}

module.exports = TypeReaderUtil;
