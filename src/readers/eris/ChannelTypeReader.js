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

module.exports = new class ChannelTypeReader extends TypeReader {
  constructor() {
    super({type: "channel"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    const {_client: client} = msg;
    let id = val.match(Constants.regexes.channelMention);

    if (!warningEmitted && !client.option.restMode
        && (client.options.firstShardID !== 0
        || client.options.lastShardID !== client.options.maxShards - 1)) {
      warningEmitted = true;
      process.emitWarning(
        "The channel TypeReader is unreliable when the restMode option is \
        disabled and shards are split between multiple processes"
      );
    }

    if (id != null || (id = val.match(Constants.regexes.id)) != null) {
      id = id[id.length - 1];

      let channel = client.getChannel(id);

      if (channel != null)
        return TypeReaderResult.fromSuccess(channel);
      else if (!client.options.restMode)
        return TypeReaderResult.fromError(cmd, "Channel not found.");

      try {
        channel = await client.getRESTChannel(id);
      } catch (e) {
        if (e.code !== Constants.errors.unknownChannel)
          throw e;
      }

      if (channel != null)
        return TypeReaderResult.fromSuccess(channel);

      return TypeReaderResult.fromError(cmd, "Channel not found.");
    } else if (msg.channel.guild == null) {
      return TypeReaderResult.fromError(cmd, "Channel not found.");
    }

    const lowerVal = val.toLowerCase();

    return TypeReaderUtil.handleMatches(
      cmd,
      msg.channel.guild.channels.filter(
        channel => channel.name.toLowerCase().startsWith(lowerVal)
      ),
      "Channel not found."
    );
  }
}();
