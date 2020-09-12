/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  patron contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const Eris = require("eris");
const Context = require("../enums/Context.js");
const ContextResult = require("../results/ContextResult.js");
const PermissionResult = require("../results/PermissionResult.js");
const perms = Object.keys(Eris.Constants.Permissions);

exports.isPerm = permission => perms.includes(permission);
exports.fetchBans = guild => guild.getBans();
exports.findBan = (bans, func) => bans.find(func);
exports.getClient = message => message.channel.client;
exports.getChannel = (message, id) => message.channel.guild.channels.get(id);
exports.getRole = (message, id) => message.channel.guild.roles.get(id);
exports.getGuild = (client, id) => client.guilds.get(id);
exports.validateContext = function(message, command) {
  if(message.channel.type === 1 && !command.usableContexts.includes(Context.DM))
    return ContextResult.fromFailure(command, Context.DM);
  else if(message.channel.guild != null && !command.usableContexts.includes(Context.Guild))
    return ContextResult.fromFailure(command, Context.Guild);
};
exports.validatePermissions = function(message, command) {
  const member = message.channel.guild.members.get(exports.getClient(message).user.id);
  let missing = command.clientPermissions.filter(p => !member.permission.has(p));

  if(missing.length !== 0)
    return PermissionResult.fromFailure(command, missing, true);

  missing = command.memberPermissions.filter(p => !message.member.permission.has(p));

  if(missing.length !== 0)
    return PermissionResult.fromFailure(command, missing);
};
exports.highestRole = function(message) {
  let highestRole = null;

  for(let i = 0; i < message.member.roles.length; i++) {
    const role = message.channel.guild.roles.get(message.member.roles[i]);

    if(role.position > highestRole?.position)
      highestRole = role;
  }

  return highestRole;
};
exports.findEmojis = function(client, func) {
  for(const guild of client.guilds.values()) {
    for(let i = 0; i < guild.emojis.length; i++) {
      if(func(guild.emojis[i]))
        return guild.emojis[i];
    }
  }
};
exports.filterEmojis = function(client, func) {
  const matches = [];

  for(const guild of client.guilds.values()) {
    for(let i = 0; i < guild.emojis.length; i++) {
      if(func(guild.emojis[i]))
        matches.push(guild.emojis[i]);
    }
  }

  return matches;
};
exports.fetchMember = function(message, id) {
  const member = message.channel.guild.members.get(id);

  if(member == null && exports.getClient(message).options.restMode)
    return message.channel.guild.getRESTMember(id);

  return member;
};
exports.fetchMessage = function(message, id) {
  const msg = message.channel.messages.get(id);

  if(msg == null && exports.getClient(message).options.restMode)
    return message.channel.getMessage(id);

  return msg;
};
exports.fetchUser = function(client, id) {
  const user = client.users.get(id);

  if(user == null && client.options.restMode)
    return client.getRESTUser(id);

  return user;
};
