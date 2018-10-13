const Constants = require('../utility/Constants.js');
const Context = require('../enums/Context.js');
const DiscordChannelType = require('../enums/DiscordChannelType.js');

class LibraryHandler {
  constructor(options) {
    this.library = options.library;
  }

  guild(message) {
    switch (this.library) {
      case 'discord.js':
        return message.guild;
      case 'eris':
        return message.channel.guild;
    }
  }

  highestRole(message) {
    switch (this.library) {
      case 'discord.js':
        return message.member.roles.highest;
      case 'eris': {
        let highestRole = null;

        for (let i = 0; i < message.member.roles.length; i++) {
          const role = message.channel.guild.roles.get(message.member.roles[i]);
          if (highestRole == null || role.position > highestRole.position) {
            highestRole = role;
          }
        }

        return highestRole;
      }
    }
  }

  validateContext(command, message) {
    switch (this.library) {
      case 'discord.js':
        if (message.channel.type === 'dm' && command.usableContexts.indexOf(Context.DM) === -1) {
          return Constants.results.invalidContext(command, Context.DM);
        } else if (message.channel.type === 'group' && command.usableContexts.indexOf(Context.GroupDM) === -1) {
          return Constants.results.invalidContext(command, Context.GroupDM);
        } else if (message.channel.type === 'text' && command.usableContexts.indexOf(Context.Guild) === -1) {
          return Constants.results.invalidContext(command, Context.Guild);
        }
        break;
      case 'eris':
        if (message.channel.type === DiscordChannelType.DM && command.usableContexts.indexOf(Context.DM) === -1) {
          return Constants.results.invalidContext(command, Context.DM);
        } else if (message.channel.type === DiscordChannelType.GroupDM && command.usableContexts.indexOf(Context.GroupDM) === -1) {
          return Constants.results.invalidContext(command, Context.GroupDM);
        } else if (message.channel.type === DiscordChannelType.TextChannel && command.usableContexts.indexOf(Context.Guild) === -1) {
          return Constants.results.invalidContext(command, Context.Guild);
        }
        break;
    }
  }

  validatePermissions(command, message) {
    switch (this.library) {
      case 'discord.js':
        if (message.channel.type !== 'text') {
          break;
        } else if (command.memberPermissions.length > 0 && message.member.hasPermission(command.memberPermissions) === false) {
          return Constants.results.memberPermissions(command, command.memberPermissions);
        } else if (command.botPermissions.length > 0 && message.guild.me.hasPermission(command.botPermissions) === false) {
          return Constants.results.botPermissions(message.client, command, command.botPermissions);
        }
        break;
      case 'eris':
        if (message.channel.type !== DiscordChannelType.TextChannel) {
          break;
        } else if (command.memberPermissions.length > 0 && command.memberPermissions.every((permission) => message.member.permission.has(permission)) === false) {
          return Constants.results.memberPermissions(command, command.memberPermissions);
        } else if (command.botPermissions.length > 0 && command.botPermissions.every((permission) => message.channel.guild.members.get(message._client.user.id).permission.has(permission)) === false) {
          return Constants.results.botPermissions(message._client, command, command.botPermissions);
        }
        break;
    }
  }
}

module.exports = LibraryHandler;
