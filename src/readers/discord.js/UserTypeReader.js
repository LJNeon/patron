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

async function parseId(client, cmd, id) {
  let user;

  try {
    user = await client.users.fetch(id);
  } catch (e) {
    if (e.code !== Constants.errors.unknownUser)
      throw e;
  }

  if (user == null)
    return TypeReaderResult.fromError(cmd, "User not found.");

  return TypeReaderResult.fromSuccess(user);
}

module.exports = new class UserTypeReader extends TypeReader {
  constructor() {
    super({type: "user"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    let id = val.match(Constants.regexes.userMention);

    if (!warningEmitted && msg.client.shard != null) {
      warningEmitted = true;
      process.emitWarning(
        "The user TypeReader is unreliable when shards are split between \
multiple clients."
      );
    }

    if (id != null || (id = val.match(Constants.regexes.id)) != null)
      return parseId(msg.client, cmd, id[id.length - 1]);

    const lowerVal = val.toLowerCase();

    if (Constants.regexes.userTag.test(val)) {
      return TypeReaderUtil.handleMatches(
        cmd,
        msg.client.users.filterValues(
          user => user.tag.toLowerCase() === lowerVal
        ),
        "User not found.",
        user => user.tag
      );
    } else if (msg.guild == null) {
      return TypeReaderResult.fromError(cmd, "User not found.");
    }

    return TypeReaderUtil.handleMatches(
      cmd,
      msg.guild.members.filterValues(
        member => member.user.username.toLowerCase().includes(lowerVal)
          || (member.nickname != null
          && member.nickname.toLowerCase().includes(lowerVal))
      ).map(member => member.user),
      "User not found.",
      user => user.tag
    );
  }
}();
