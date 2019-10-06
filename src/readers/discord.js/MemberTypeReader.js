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

module.exports = new class MemberTypeReader extends TypeReader {
  constructor() {
    super({type: "member"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    let id = val.match(Constants.regexes.userMention);

    if (!warningEmitted && !msg.client.options.fetchAllMembers) {
      warningEmitted = true;
      process.emitWarning(
        "The member TypeReader is unreliable when the fetchAllMembers option \
is disabled."
      );
    }

    if (id != null || (id = val.match(Constants.regexes.id)) != null) {
      const member = msg.guild.members.get(id[id.length - 1]);

      if (member == null)
        return TypeReaderResult.fromError(cmd, "Member not found.");

      return TypeReaderResult.fromSuccess(member);
    }

    const lowerVal = val.toLowerCase();

    if (Constants.regexes.userTag.test(val)) {
      return TypeReaderUtil.handleMatches(
        cmd,
        msg.guild.members.filterValues(
          member => member.user.tag.toLowerCase() === lowerVal
        ),
        "Member not found.",
        member => member.user.tag
      );
    }

    return TypeReaderUtil.handleMatches(
      cmd,
      msg.guild.members.filterValues(
        member => member.user.username.toLowerCase().startsWith(lowerVal)
          || (member.nickname != null
          && member.nickname.toLowerCase().startsWith(lowerVal))
      ),
      "Member not found.",
      member => member.user.tag
    );
  }
}();
