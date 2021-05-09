/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  LJ Talbot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const Discord = require("discord.js");
const Context = require("../enums/Context.js");
const ContextResult = require("../results/ContextResult.js");
const PermissionResult = require("../results/PermissionResult.js");
const perms = Object.keys(Discord.Permissions.FLAGS);

exports.isPerm = permission => perms.includes(permission);
exports.fetchBans = guild => guild.fetchBans();
exports.highestRole = message => message.member.roles.highest;
exports.getClient = message => message.client;
exports.getChannel = (message, id) => message.guild.channels.resolve(id);
exports.fetchMember = (message, id) => message.guild.members.fetch(id);
exports.fetchMessage = (message, id) => message.channel.messages.fetch(id);
exports.getRole = (message, id) => message.guild.roles.resolve(id);
exports.getGuild = (client, id) => client.guilds.resolve(id);
exports.fetchUser = (client, id) => client.users.fetch(id);
exports.validateContext = function(message, command) {
  if(message.channel.type === "dm" && !command.usableContexts.includes(Context.DM))
    return ContextResult.fromFailure(command, Context.DM);
  else if(message.guild != null && !command.usableContexts.includes(Context.Guild))
    return ContextResult.fromFailure(command, Context.Guild);
};
exports.validatePermissions = function(message, command) {
  let missing = command.clientPermissions.filter(p => !message.guild.me.hasPermission(p));

  if(missing.length !== 0)
    return PermissionResult.fromFailure(command, missing, true);

  missing = command.memberPermissions.filter(p => !message.member.hasPermission(p));

  if(missing.length !== 0)
    return PermissionResult.fromFailure(command, missing);
};
exports.findBan = function(bans, func) {
  for(const ban of bans.values()) {
    if(func(ban))
      return ban;
  }
};
exports.findEmojis = function(client, func) {
  for(const emoji of client.emojis.values()) {
    if(func(emoji))
      return emoji;
  }
};
exports.filterEmojis = function(client, func) {
  const matches = [];

  for(const emoji of client.emojis.values()) {
    if(func(emoji))
      matches.push(emoji);
  }

  return matches;
};
