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
const TypeReader = require("../../structures/TypeReader.js");
const TypeReaderCategory = require("../../enums/TypeReaderCategory.js");
const TypeReaderResult = require("../../results/TypeReaderResult.js");
const TypeReaderUtil = require("../../utility/TypeReaderUtil.js");
let warningEmitted = false;

function checkForWarn(client) {
  if (!warningEmitted && client.shard !== null) {
    warningEmitted = true;
    process.emitWarning(
      "The DM channel TypeReader is unreliable when shards are split between \
multiple processes."
    );
  }
}

async function matchFromId(cmd, client, id) {
  let channel = client.channels.get(id);

  if (channel == null) {
    try {
      channel = await client.api.channels[id].get();
    } catch (e) {
      if (e.code !== Constants.errors.unknownChannel)
        throw e;
    }
  }

  if (channel != null && channel.type === "dm")
    return TypeReaderResult.fromSuccess(channel);

  let user;

  try {
    user = await client.users.fetch(id);
  } catch (e) {
    if (e.code !== Constants.errors.unknownUser)
      throw e;
  }

  if (user == null)
    return TypeReaderResult.fromError(cmd, "DM channel not found.");

  return TypeReaderResult.fromSuccess(await user.createDM());
}

async function matchWithGuild(msg, cmd, lowerVal) {
  const matches = msg.guild.members.filterValues(
    member => member.user.username.toLowerCase().includes(lowerVal)
      || (member.nickname != null
      && member.nickname.toLowerCase().includes(lowerVal))
  );

  if (matches.length === 0)
    return TypeReaderResult.fromError(cmd, "DM channel not found.");

  const max = Math.min(matches.length, Constants.config.maxMatches);

  for (let i = 0; i < max; i++)
    matches[i] = await matches[i].user.createDM();

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
    const lowerVal = val.toLowerCase();
    let id = val.match(Constants.regexes.id);

    checkForWarn(msg.client);

    if (id != null) {
      return matchFromId(cmd, msg.client, id[0]);
    } else if ((id = val.match(Constants.regexes.userMention)) != null) {
      let user;

      try {
        user = await msg.client.users.fetch(id[1]);
      } catch (e) {
        if (e.code !== Constants.errors.unknownUser)
          throw e;
      }

      if (user == null)
        return TypeReaderResult.fromError(cmd, "DM channel not found.");

      return TypeReaderResult.fromSuccess(await user.getDMChannel());
    } else if (Constants.regexes.userTag.test(val)) {
      const matches = msg.client.users.filterValues(
        user => user.tag.toLowerCase() === lowerVal
      );

      if (matches.length === 0)
        return TypeReaderResult.fromError(cmd, "DM Channel not found.");

      const max = Math.min(matches.length, Constants.config.maxMatches);

      for (let i = 0; i < max; i++)
        matches[i] = await matches[i].createDM();

      return TypeReaderUtil.handleMatches(cmd, matches);
    } else if (msg.channel.guild == null) {
      return TypeReaderResult.fromError(cmd, "DM channel not found.");
    }

    return matchWithGuild(msg, cmd, lowerVal);
  }
}();
