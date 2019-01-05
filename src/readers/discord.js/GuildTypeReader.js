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

module.exports = new class GuildTypeReader extends TypeReader {
  constructor() {
    super({type: "guild"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    if (!warningEmitted && msg.client.shard != null) {
      warningEmitted = true;
      process.emitWarning(
        "The guild TypeReader is unreliable when shards are \
split between multiple processes."
      );
    }

    const id = val.match(Constants.regexes.id);

    if (id != null) {
      const guild = msg.client.guilds.get(id[0]);

      if (guild != null)
        return TypeReaderResult.fromError(cmd, "Server not found.");

      return TypeReaderResult.fromSuccess(guild);
    }

    const lowerVal = val.toLowerCase();

    return TypeReaderUtil.handleMatches(
      cmd,
      msg.client.guilds.filterValues(
        guild => guild.name.toLowerCase().startsWith(lowerVal)
      ),
      "Server not found."
    );
  }
}();
