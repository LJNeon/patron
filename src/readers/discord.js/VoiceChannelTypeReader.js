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

module.exports = new class VoiceChannelTypeReader extends TypeReader {
  constructor() {
    super({type: "voicechannel"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    let id = val.match(Constants.regexes.channelMention);

    if (id != null || (id = val.match(Constants.regexes.id)) != null) {
      const channel = msg.guild.channels.get(id[id.length - 1]);

      if (channel != null && channel.type === "voice")
        return TypeReaderResult.fromSuccess(channel);

      return TypeReaderResult.fromError(cmd, "Voice channel not found.");
    }

    const lowerVal = val.toLowerCase();

    return TypeReaderUtil.handleMatches(
      cmd,
      msg.guild.channels.filterValues(
        channel => channel.name.toLowerCase().startsWith(lowerVal)
          && channel.type === "voice"
      ),
      "Voice channel not found."
    );
  }
}();
