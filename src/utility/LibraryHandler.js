/*
 * patron.js - The cleanest command framework for discord.js and eris.
 * Copyright (c) 2019 patron.js contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";
const Context = require("../enums/Context.js");
const DiscordChannelType = require("../enums/DiscordChannelType.js");
const InvalidContextResult = require("../results/InvalidContextResult.js");
const PermissionResult = require("../results/PermissionResult.js");

module.exports = class LibraryHandler {
  constructor(options) {
    this.library = options.library;
  }

  guild(message) {
    switch (this.library) {
      case "discord.js":
        return message.guild;
      case "eris":
        return message.channel.guild;
    }
  }

  highestRole(message) {
    switch (this.library) {
      case "discord.js":
        return message.member.roles.highest;
      case "eris": {
        let highestRole = null;

        for (let i = 0; i < message.member.roles.length; i++) {
          const role = message.channel.guild.roles.get(message.member.roles[i]);

          if (highestRole == null || role.position > highestRole.position)
            highestRole = role;
        }

        return highestRole;
      }
    }
  }

  validateContext(command, message) {
    switch (this.library) {
      case "discord.js":
        if (message.channel.type === "dm"
            && !command.usableContexts.includes(Context.DM))
          return InvalidContextResult.fromError(command, Context.DM);
        else if (message.channel.type === "text"
            && !command.usableContexts.includes(Context.Guild))
          return InvalidContextResult.fromError(command, Context.Guild);

        break;
      case "eris":
        if (message.channel.type === DiscordChannelType.DM
            && !command.usableContexts.includes(Context.DM))
          return InvalidContextResult.fromError(command, Context.DM);
        else if (message.channel.type === DiscordChannelType.TextChannel
            && !command.usableContexts.includes(Context.Guild))
          return InvalidContextResult.fromError(command, Context.Guild);

        break;
    }
  }

  validatePermissions(cmd, msg) {
    switch (this.library) {
      case "discord.js": {
        const botMissingPerms = cmd.botPermissions.filter(
          permission => !msg.guild.me.hasPermission(permission)
        );
        const memberMissingPerms = cmd.memberPermissions.filter(
          permission => !msg.member.hasPermission(permission)
        );

        if (msg.channel.type !== "text")
          break;
        else if (botMissingPerms.length !== 0)
          return PermissionResult.fromBot(cmd, botMissingPerms);
        else if (memberMissingPerms.length !== 0)
          return PermissionResult.fromMember(cmd, memberMissingPerms);

        break;
      }
      case "eris": {
        const {_client: client} = msg;
        const botMissingPerms = cmd.botPermissions.filter(
          p => !msg.channel.guild.members.get(client.user.id).permission.has(p)
        );
        const memberMissingPerms = cmd.memberPermissions.filter(
          permission => !msg.member.permission.has(permission)
        );

        if (msg.channel.type !== DiscordChannelType.TextChannel)
          break;
        else if (botMissingPerms.length !== 0)
          return PermissionResult.fromBot(cmd, botMissingPerms);
        else if (memberMissingPerms.length !== 0)
          return PermissionResult.fromMember(cmd, memberMissingPerms);

        break;
      }
    }
  }
};
