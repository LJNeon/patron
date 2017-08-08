const Result = require('../results/Result.js');
const PermissionUtil = require('../utility/PermissionUtil.js');
const CommandError = require('../enums/CommandError.js');

class Constants {
  constructor() {
    this.config = {
      maxMatches: 5
    };

    this.errors = {
      guildNotFound: 'Guild not found.',
      invalidArg: (argument) => 'You have provided an invalid ' + argument.name + '.',
      memberNotFound: 'Member not found.',
      multipleMatches: (matches) => 'Multiple matches found: ' + matches + '.',
      roleNotFound: 'Role not found.',
      textChannelNotFound: 'Text channel not found.',
      tooManyMatches: 'Multiple matches found, please be more specific.',
      userNotFound: 'User not found.',
      voiceChannelNotFound: 'Voice channel not found.'
    };

    this.results = {
      botPermissions: (client, command, permissions) => new Result({ success: false, command: command, commandError: CommandError.botPermission, errorReason: client.user.username + ' cannot execute this command without the ' + PermissionUtil.format(permissions) + ' permission' + (permissions.length > 1 ? 's' : '') + '.' }),
      commandNotFound: new Result({ success: false, commandError: CommandError.CommandNotFound, errorReason: 'This command does not exist.' }),
      guildOnly: (command) => new Result({ success: false, command: command, commandError: CommandError.GuildOnly, errorReason: 'This command may only be used inside a server.' }),
      invalidArgCount: (command) => new Result({ success: false, command: command, commandError: CommandError.InvalidArgCount, errorReason: 'You have provided an invalid number of arguments.' }),
      memberPermissions: (command, permissions) => new Result({ success: false, command: command, commandError: CommandError.memberPermission, errorReason: 'This command may only be used by members with the ' + permissions + ' permission' + (permissions.length > 1 ? 's' : '') + '.' }),
      success: (command) => new Result({ success: true, command: command })
    };

    this.regexes = {
      argument: /"[\S\s]+?"|[\S\n]+/g,
      escapeRegex: /[-/\\^$*+?.()|[\]{}]/g,
      id: /^\d{17,19}/,
      parseId: /\D+/g,
      permission: /[A-Z]+/g,
      quotes: /^"|"$/g,
      quotesMatch: /^"[\S\s]+"$/,
      roleMention: /^<@&\d+>/,
      textChannelMention: /^<#\d+>/,
      usernameAndDiscrim: /.+#\d{4}/,
      userMention: /^<@!?\d+>/,
      whiteSpace: /\s/
    };
  }
}

module.exports = new Constants();
