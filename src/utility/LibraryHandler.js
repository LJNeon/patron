const Constants = require('../utility/Constants.js');
const Context = require('../enums/Context.js');
const DiscordChannelType = require('../enums/DiscordChannelType.js');
const InvalidContextResult = require('../results/InvalidContextResult.js');

class LibraryHandler {
  constructor(options) {
    this.library = options.library;
  }

  validateContext(command, message) {
    switch(this.library) {
      case 'discord.js':
        if (message.channel.type === 'dm' && command.usableContexts.indexOf(Context.DM) === -1) {
          return InvalidContextResult.from(command, Context.DM);
        } else if (message.channel.type === 'group' && command.usableContexts.indexOf(Context.GroupDM) === -1) {
          return InvalidContextResult.from(command, Context.GroupDM);
        }
        break;
      case 'eris':
        if (message.channel.type === DiscordChannelType.DM && command.usableContexts.indexOf(Context.DM) === -1) {
          return InvalidContextResult.from(command, Context.DM);
        } else if (message.channel.type === DiscordChannelType.GroupDM && command.usableContexts.indexOf(Context.GroupDM) === -1) {
          return InvalidContextResult.from(command, Context.GroupDM);
        }
        break;
    }
  }

  validatePermissions(command, message) {
    switch (this.library) {
      case 'discord.js':
        if (command.memberPermissions.length > 0 && message.member.hasPermission(command.memberPermissions) === false) {
          return Constants.results.memberPermissions(command, command.memberPermissions);
        } else if (command.botPermissions.length > 0 && message.guild.me.hasPermission(command.botPermissions) === false) {
          return Constants.results.botPermissions(message.client, command, command.botPermissions);
        }
        break;
      case 'eris':
        if (command.memberPermissions.length > 0 && command.memberPermissions.every((permission) => message.member.permission.has(permission) === true) === false) {
          return Constants.results.memberPermissions(command, command.memberPermissions);
        } else if (command.botPermissions.length > 0 && command.botPermissions.every((permission) => message.channel.guild.members.get(message._client.user.id).permission.has(permission) === true) === false) {
          return Constants.results.botPermissions(message._client, command, command.botPermissions);
        }
        break;
    }
  }
}

module.exports = LibraryHandler;
