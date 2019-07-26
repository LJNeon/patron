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
let warningEmitted = false;

module.exports = new class MemberTypeReader extends TypeReader {
  constructor() {
    super({type: "member"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    const {_client: client} = msg;
    let id = val.match(Constants.regexes.userMention);

    if (!warningEmitted && !client.options.getAllUsers) {
      warningEmitted = true;
      process.emitWarning(
        "The member TypeReader is unreliable when the getAllUsers option is \
        disabled."
      );
    }

    if (id != null || (id = val.match(Constants.regexes.id)) != null) {
      const member = msg.channel.guild.members.get(id[id.length - 1]);

      if (member == null)
        return TypeReaderResult.fromError(cmd, "Member not found.");

      return TypeReaderResult.fromSuccess(member);
    }

    const lowerVal = val.toLowerCase();

    if (Constants.regexes.userTag.test(val)) {
      return TypeReaderUtil.handleMatches(
        cmd,
        msg.channel.guild.members.filter(
          m => `${m.username.toLowerCase()}#${m.discriminator}` === lowerVal
        ),
        "Member not found.",
        m => `${StringUtil.escapeMarkdown(m.username)}#${m.discriminator}`
      );
    }

    return TypeReaderUtil.handleMatches(
      cmd,
      msg.channel.guild.members.filter(
        m => m.username.toLowerCase().startsWith(lowerVal)
          || (m.nick != null
          && m.nick.toLowerCase().startsWith(lowerVal))
      ),
      "Member not found.",
      m => `${StringUtil.escapeMarkdown(m.username)}#${m.discriminator}`
    );
  }
}();
