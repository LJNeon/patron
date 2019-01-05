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
const Constants = require("../../utility/Constants.js");
const DiscordChannelType = require("../../enums/DiscordChannelType.js");
const TypeReader = require("../../structures/TypeReader.js");
const TypeReaderCategory = require("../../enums/TypeReaderCategory.js");
const TypeReaderResult = require("../../results/TypeReaderResult.js");
const TypeReaderUtil = require("../../utility/TypeReaderUtil.js");
const warningEmitted = [false, false];

function checkForWarn(client) {
  if (!warningEmitted[0] && !client.options.getAllUsers
      && !client.options.restMode) {
    warningEmitted[0] = true;
    process.emitWarning(
      "The DM channel TypeReader is unreliable when the getAllUsers and \
      restMode options are both disabled."
    );
  }

  if (!warningEmitted[1] && (client.options.firstShardID !== 0
      || client.options.lastShardID !== client.options.maxShards - 1)) {
    warningEmitted[1] = true;
    process.emitWarning(
      "The DM channel TypeReader is unreliable when shards are split between \
      multiple processes."
    );
  }
}

async function matchFromId(cmd, client, id) {
  let channel = client.privateChannels.find(dm => dm.id === id[0]);

  if (channel == null && client.options.restMode) {
    try {
      channel = await client.getRESTChannel(id[0]);
    } catch (e) {
      if (e.code !== Constants.errors.unknownChannel)
        throw e;
    }
  }

  if (channel != null && channel.type === DiscordChannelType.DM)
    return TypeReaderResult.fromSuccess(channel);

  let user = client.users.get(id[0]);

  if (user != null)
    return TypeReaderResult.fromSuccess(await user.getDMChannel());
  else if (!client.options.restMode)
    return TypeReaderResult.fromError(cmd, "DM channel not found.");

  try {
    user = await client.getRESTUser(id[0]);
  } catch (e) {
    if (e.code !== Constants.errors.unknownUser)
      throw e;
  }

  if (user == null)
    return TypeReaderResult.fromError(cmd, "DM channel not found.");

  return TypeReaderResult.fromSuccess(await user.getDMChannel());
}

async function matchWithGuild(msg, cmd, lowerVal) {
  const matches = msg.channel.guild.members.filter(
    member => member.username.toLowerCase().includes(lowerVal)
      || (member.nickname != null
      && member.nickname.toLowerCase().includes(lowerVal))
  );

  if (matches.length === 0)
    return TypeReaderResult.fromError(cmd, "DM channel not found.");

  const max = Math.min(matches.length, Constants.config.maxMatches);

  for (let i = 0; i < max; i++)
    matches[i] = await matches[i].user.getDMChannel();

  return TypeReaderUtil.handleMatches(
    cmd,
    matches,
    null,
    d => d.id
  );
}

module.exports = new class DMChannelTypeReader extends TypeReader {
  constructor() {
    super({type: "dmchannel"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    const {_client: client} = msg;
    const lowerVal = val.toLowerCase();
    let id = val.match(Constants.regexes.id);

    checkForWarn(client);

    if (id != null) {
      return matchFromId(cmd, client, id);
    } else if ((id = val.match(Constants.regexes.userMention)) != null) {
      let user = client.users.get(id[1]);

      if (user != null)
        return TypeReaderResult.fromSuccess(await user.getDMChannel());
      else if (!client.options.restMode)
        return TypeReaderResult.fromError(cmd, "DM channel not found.");

      try {
        user = await client.getRESTUser(id[1]);
      } catch (e) {
        if (e.code !== Constants.errors.unknownUser)
          throw e;
      }

      if (user == null)
        return TypeReaderResult.fromError(cmd, "DM channel not found.");

      return TypeReaderResult.fromSuccess(await user.getDMChannel());
    } else if (Constants.regexes.userTag.test(val)) {
      const matches = client.users.filter(
        u => `${u.username.toLowerCase()}#${u.discriminator}` === lowerVal
      );

      if (matches.length === 0)
        return TypeReaderResult.fromError(cmd, "DM Channel not found.");

      const max = Math.min(matches.length, Constants.config.maxMatches);

      for (let i = 0; i < max; i++)
        matches[i] = await matches[i].getDMChannel();

      return TypeReaderUtil.handleMatches(cmd, matches);
    } else if (msg.channel.guild == null) {
      return TypeReaderResult.fromError(cmd, "DM channel not found.");
    }

    return matchWithGuild(msg, cmd, lowerVal);
  }
}();
