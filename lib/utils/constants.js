/*
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  patron contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";

exports.errors = {
  unknownMember: 10007,
  unknownMessage: 10008,
  unknownUser: 10013
};
exports.regexes = {
  quotes: /^["“]|["”]$/g,
  argument: /["“][\S\s]+?["”]|[\S\n]+/g,
  markdown: /[<@!#&>:_~*`|\\]/g,
  urlMarkdown: /^<|>$/g,
  tag: /#\d{4}$/,
  id: /^\d+$/,
  emoji: /<a?:(\w+):(\d+)>/,
  channelMention: /<#(\d+)>/,
  roleMention: /<@&(\d+)>/,
  userMention: /<@!?(\d+)>/
};
exports.falsey = ["false", "off", "no", "na", "nah", "naw", "nope"];
exports.truthy = ["true", "on", "yes", "ye", "yea", "yeah", "yep", "yup"];
exports.times = {
  day: {ms: 864e5, plural: "days", short: "d"},
  hour: {ms: 36e5, plural: "hours", short: "h"},
  millisecond: {
    ms: 1,
    plural: "milliseconds",
    short: "ms"
  },
  minute: {ms: 6e4, plural: "minutes"},
  month: {ms: 2629822965.84, plural: "months"},
  second: {
    ms: 1e3,
    plural: "seconds",
    short: "s"
  },
  week: {
    ms: 6048e5,
    plural: "weeks",
    short: "w"
  },
  year: {
    ms: 31557875590.08,
    plural: "years",
    short: "y"
  }
};
exports.usageAsUser = ["member", "role", "user"];
exports.usageAsChannel = ["channel", "dm", "text", "voice"];
