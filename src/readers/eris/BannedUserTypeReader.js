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
const StringUtil = require("../../utility/StringUtil.js");
const TypeReader = require("../../structures/TypeReader.js");
const TypeReaderCategory = require("../../enums/TypeReaderCategory.js");
const TypeReaderResult = require("../../results/TypeReaderResult.js");
const TypeReaderUtil = require("../../utility/TypeReaderUtil.js");

module.exports = new class BannedUserTypeReader extends TypeReader {
  constructor() {
    super({type: "banneduser"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    const bans = await msg.channel.guild.getBans();
    let id = val.match(Constants.regexes.userMention);

    if (id != null || (id = val.match(Constants.regexes.id)) != null) {
      id = id[id.length - 1];

      const user = bans.find(ban => ban.id === id);

      if (user == null)
        return TypeReaderResult.fromError(cmd, "Banned user not found.");

      return TypeReaderResult.fromSuccess(user);
    }

    const lowerVal = val.toLowerCase();

    if (Constants.regexes.userTag.test(val)) {
      return TypeReaderUtil.handleMatches(
        cmd,
        bans.filter(
          b => `${b.username.toLowerCase()}#${b.discriminator}` === lowerVal
        ),
        "Banned user not found.",
        b => `${StringUtil.escapeMarkdown(b.username)}#${b.discriminator}`
      );
    }

    return TypeReaderUtil.handleMatches(
      cmd,
      bans.filter(
        ban => ban.username.toLowerCase().includes(lowerVal)
      ),
      "Banned user not found.",
      b => `${StringUtil.escapeMarkdown(b.username)}#${b.discriminator}`
    );
  }
}();
