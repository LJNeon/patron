/*
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
const Context = require("../enums/Context.js");
const ContextResult = require("../results/ContextResult.js");
const PermissionResult = require("../results/PermissionResult.js");

const funcs = {};
let eris = false;
let djs = false;
let lib;
let perms;

try {
  lib = require("eris");
  eris = true;
}catch{}

try {
  lib = require("discord.js");
  djs = true;
}catch{}

if(eris && djs) {
  console.error("ReferenceError: Both eris and discord.js are installed, please uninstall one.");
  process.exit(1);
}else if(!(eris || djs)) {
  console.error("ReferenceError: Neither eris nor discord.js are installed, please install one.");
  process.exit(1);
}

if(eris) {
  funcs.isPerm = permission => {
    if(perms == null)
      perms = Object.keys(lib.Constants.Permissions);

    return perms.includes(permission);
  };
  funcs.validateContext = (message, command) => {
    if(message.channel.type === 1 && !command.usableContexts.includes(Context.DM))
      return ContextResult.fromFailure(command, Context.DM);
    else if(message.channel.guild != null && !command.usableContexts.includes(Context.Guild))
      return ContextResult.fromFailure(command, Context.Guild);
  };
  funcs.validatePermissions = function(message, command) {
    const member = message.channel.guild.members.get(this.getClient(message).user.id);
    let missing = command.clientPermissions.filter(p => !member.permission.has(p));

    if(missing.length !== 0)
      return PermissionResult.fromFailure(command, missing, true);

    missing = command.memberPermissions.filter(p => !message.member.permission.has(p));

    if(missing.length !== 0)
      return PermissionResult.fromFailure(command, missing);
  };
  funcs.highestRole = message => {
    let highestRole = null;

    for(let i = 0; i < message.member.roles.length; i++) {
      const role = message.channel.guild.roles.get(message.member.roles[i]);

      if(highestRole == null || role.position > highestRole.position)
        highestRole = role;
    }

    return highestRole;
  };
  funcs.fetchBans = guild => guild.getBans();
  funcs.findBan = (bans, func) => bans.find(func);
  funcs.getClient = message => {
    // Not preferred, but unavoidable.
    if(message.channel.guild == null)
      return message._client;

    return message.channel.guild.shard.client;
  };
  funcs.getChannel = (message, id) => message.channel.guild.channels.get(id);
  funcs.findEmojis = (client, func) => {
    for(const guild of client.guilds.values()) {
      for(let i = 0; i < guild.emojis.length; i++) {
        if(func(guild.emojis[i]))
          return guild.emojis[i];
      }
    }
  };
  funcs.filterEmojis = (client, func) => {
    const matches = [];

    for(const guild of client.guilds.values()) {
      for(let i = 0; i < guild.emojis.length; i++) {
        if(func(guild.emojis[i]))
          matches.push(guild.emojis[i]);
      }
    }

    return matches;
  };
  funcs.getGuild = (client, id) => client.guilds.get(id);
  funcs.fetchMember = function(message, id) {
    const member = message.channel.guild.members.get(id);

    if(member == null && this.getClient(message).options.restMode)
      return message.channel.guild.getRESTMember(id);

    return member;
  };
  funcs.fetchMessage = function(message, id) {
    const msg = message.channel.messages.get(id);

    if(msg == null && this.getClient(message).options.restMode)
      return message.channel.getMessage(id);

    return msg;
  };
  funcs.getRole = (message, id) => message.channel.guild.roles.get(id);
  funcs.fetchUser = (client, id) => {
    const user = client.users.get(id);

    if(user == null && client.options.restMode)
      return client.getRESTUser(id);

    return user;
  };
}else{
  funcs.isPerm = permission => {
    if(perms == null)
      perms = Object.keys(lib.Permissions.FLAGS);

    return perms.includes(permission);
  };
  funcs.validateContext = (message, command) => {
    if(message.channel.type === "dm" && !command.usableContexts.includes(Context.DM))
      return ContextResult.fromFailure(command, Context.DM);
    else if(message.guild != null && !command.usableContexts.includes(Context.Guild))
      return ContextResult.fromFailure(command, Context.Guild);
  };
  funcs.validatePermissions = (message, command) => {
    let missing = command.clientPermissions.filter(p => !message.guild.me.hasPermission(p));

    if(missing.length !== 0)
      return PermissionResult.fromFailure(command, missing, true);

    missing = command.memberPermissions.filter(p => !message.member.hasPermission(p));

    if(missing.length !== 0)
      return PermissionResult.fromFailure(command, missing);
  };
  funcs.highestRole = message => message.member.roles.highest;
  funcs.fetchBans = guild => guild.fetchBans();
  funcs.findBan = (bans, func) => {
    for(const ban of bans.values()) {
      if(func(ban))
        return ban;
    }
  };
  funcs.getClient = message => message.client;
  funcs.getChannel = (message, id) => message.guild.channels.resolve(id);
  funcs.findEmojis = (client, func) => {
    for(const emoji of client.emojis.values()) {
      if(func(emoji))
        return emoji;
    }
  };
  funcs.filterEmojis = (client, func) => {
    const matches = [];

    for(const emoji of client.emojis.values()) {
      if(func(emoji))
        matches.push(emoji);
    }

    return matches;
  };
  funcs.getGuild = (client, id) => client.guilds.resolve(id);
  funcs.fetchMember = (message, id) => message.guild.members.fetch(id);
  funcs.fetchMessage = (message, id) => message.channel.messages.fetch(id);
  funcs.getRole = (message, id) => message.guild.roles.resolve(id);
  funcs.fetchUser = (client, id) => client.users.fetch(id);
}

module.exports = funcs;
