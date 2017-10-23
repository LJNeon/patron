const Constants = require('../utility/Constants.js');

class LibraryHandler {
  constructor(options) {
    this.library = options.library;
  }

  validatePermissions(message, command) {
    switch (this.library) {
      case 'discord.js':
        if (command.memberPermissions.length > 0 && message.member.hasPermission(command.memberPermissions) === false) {
          return Constants.results.memberPermissions(command, command.memberPermissions);
        }

        if (command.botPermissions.length > 0 && message.guild.me.hasPermission(command.botPermissions) === false) {
          return Constants.results.botPermissions(message.client, command, command.botPermissions);
        }
        break;
      case 'eris':
        if (command.memberPermissions.length > 0 && command.memberPermissions.every((permission) => message.member.permission.has(permission) === true) === false) {
          return Constants.results.memberPermissions(command, command.memberPermissions);
        }

        if (command.botPermissions.length > 0 && command.botPermissions.every((permission) => message.channel.guild.members.get(message._client.user.id).permission.has(permission) === true) === false) {
          return Constants.results.botPermissions(message.client, command, command.botPermissions);
        }
        break;
    }
  }
}

module.exports = LibraryHandler;
