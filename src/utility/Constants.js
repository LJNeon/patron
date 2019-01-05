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
module.exports = {
  config: {maxMatches: 4},
  conversions: {
    greenToHex: 8,
    redToHex: 16
  },
  errors: {
    unknownChannel: 10003,
    unknownMsg: 10008,
    unknownUser: 10013
  },
  falseValues: [
    "false",
    "n",
    "na",
    "nah",
    "naw",
    "no",
    "nop",
    "nope"
  ],
  numbers: {
    hexLength: -6,
    hexPiece: 2,
    maxCommas: 2,
    maxRGB: 255,
    smallHexLength: -3
  },
  regexes: {
    argument: /"[\S\s]+?"|[\S\n]+/g,
    channelMention: /<#(\d{14,20})>/,
    emoji: /<:\w{2,32}:(\d{14,20})>/,
    hex: /^(0x|#)?[\da-f]{6}$/i,
    id: /^\d{14,20}$/,
    markdown: /[<@!#&>:_~*`\\]/g,
    number: /^\d+(\.\d+)?/,
    quotes: /^"|"$/g,
    rgb: /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/i,
    roleMention: /<@&(\d{14,20})>/,
    smallHex: /^(0x|#)?[\da-f]{3}$/i,
    startWhitespace: /^\s/,
    userMention: /<@!?(\d{14,20})>/,
    userTag: /[\S\s]{1,32}#\d{4}/,
    whiteSpace: /\s/,
    word: /\b[a-z]+|\B[A-Z][a-z]+|[A-Z]+/g
  },
  times: {
    century: {
      ms: 3155787559008,
      plural: "centuries"
    },
    day: {
      ms: 864e5,
      plural: "days",
      short: "d"
    },
    decade: {
      ms: 315578755900.8,
      plural: "decades"
    },
    hour: {
      ms: 36e5,
      plural: "hours",
      short: "h"
    },
    millisecond: {
      ms: 1,
      plural: "milliseconds",
      short: "ms"
    },
    minute: {
      ms: 6e4,
      plural: "minutes"
    },
    month: {
      ms: 2629822965.84,
      plural: "months"
    },
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
  },
  trueValues: [
    "true",
    "y",
    "ye",
    "yea",
    "yeah",
    "yes",
    "yep",
    "yup"
  ]
};
