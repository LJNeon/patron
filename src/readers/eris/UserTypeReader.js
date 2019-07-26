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
const warningEmitted = [false, false];

function checkForWarn(client) {
  if (!warningEmitted[0] && !client.options.getAllUsers
      && !client.options.restMode) {
    warningEmitted[0] = true;
    process.emitWarning(
      "The user TypeReader is unreliable when the getAllUsers and restMode \
      options are both disabled."
    );
  }

  if (!warningEmitted[1] && (client.options.firstShardID !== 0
      || client.options.lastShardID !== client.options.maxShards - 1)) {
    warningEmitted[1] = true;
    process.emitWarning(
      "The user TypeReader is unreliable when shards are split between \
      multiple processes."
    );
  }
}

async function parseId(client, cmd, id) {
  let user = client.users.get(id);

  if (user == null && !client.options.restMode)
    return TypeReaderResult.fromError(cmd, "User not found.");

  try {
    user = await client.getRESTUser(id);
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
    const {_client: client} = msg;
    let id = val.match(Constants.regexes.userMention);

    checkForWarn(client);

    if (id != null || (id = val.match(Constants.regexes.id)) != null)
      return parseId(client, cmd, id[id.length - 1]);

    const lowerVal = val.toLowerCase();

    if (Constants.regexes.userTag.test(val)) {
      return TypeReaderUtil.handleMatches(
        cmd,
        client.users.filter(
          u => `${u.username.toLowerCase()}#${u.discriminator}` === lowerVal
        ),
        "User not found.",
        u => `${StringUtil.escapeMarkdown(u.username)}#${u.discriminator}`
      );
    } else if (msg.channel.guild == null) {
      return TypeReaderResult.fromError(cmd, "User not found.");
    }

    return TypeReaderUtil.handleMatches(
      cmd,
      msg.channel.guild.members.filter(
        member => member.username.toLowerCase().includes(lowerVal)
          || (member.nick != null
          && member.nick.toLowerCase().includes(lowerVal))
      ).map(member => member.user),
      "User not found.",
      u => `${StringUtil.escapeMarkdown(u.username)}#${u.discriminator}`
    );
  }
}();
