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

module.exports = new class MessageTypeReader extends TypeReader {
  constructor() {
    super({type: "message"});
    this.category = TypeReaderCategory.Library;
  }

  async read(cmd, msg, arg, args, val) {
    const id = val.match(Constants.regexes.id);

    if (id != null) {
      let message = msg.channel.messages.get(id[0]);

      if (message != null)
        return TypeReaderResult.fromSuccess(message);

      try {
        message = await msg.channel.messages.fetch(id);
      } catch (e) {
        if (e.code !== Constants.errors.unknownMsg)
          throw e;
      }

      if (message == null)
        return TypeReaderResult.fromError(cmd, "Message not found.");

      return TypeReaderResult.fromSuccess(message);
    }

    const lowerVal = val.toLowerCase();

    return TypeReaderUtil.handleMatches(
      cmd,
      msg.channel.messages.filterValues(
        m => m.content.toLowerCase().startsWith(lowerVal)
      ),
      "Message not found.",
      m => m.id
    );
  }
}();
