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
const {invalidOptions} = require("../utils/structUtil.js");
const MultiMutex = require("../utils/MultiMutex.js");
const {Type} = require("typedoc/dist/lib/models");

class Cooldown {
  constructor(options) {
    if(typeof options === "number") {
      this.aggressive = false;
      this.duration = options;
      this.limit = 1;
      this.sorter = undefined;
      this.expires = undefined;
    }else if(invalidOptions(options)) {
      throw ReferenceError("The Cooldown constructor requires a number or options object.");
    }else{
      this.aggressive = options.aggressive ?? false;
      this.duration = options.duration;
      this.limit = options.limit ?? 1;
      this.sorter = options.sorter;
      this.expires = options.expires;
    }

    Cooldown.validate(this);
    this.users = new Map();
    this.mutex = new MultiMutex();

    if(this.expires != null) {
      this.maxTime = this.expires * 6e4;
      setInterval(async () => {
        for(const key of this.users.keys()) {
          await this.mutex.lock(key);

          if(Date.now() - this.users.get(key).reset > this.maxTime)
            this.users.delete(key);

          this.mutex.unlock(key);
        }
      }, Math.floor(this.expires * 12e3));
    }
  }

  async get(message) {
    const key = await this.getKey(message);

    await this.mutex.lock(key);

    if(!this.invalid(key)) {
      this.mutex.unlock(key);

      return this.users.get(key);
    }

    this.mutex.unlock(key);
  }

  async use(message) {
    const key = await this.getKey(message);

    await this.mutex.lock(key);

    const user = this.users.get(key);

    if(this.invalid(key) || user.used === 0) {
      this.users.set(key, {
        reset: Date.now() + this.duration,
        used: 1
      });
      this.mutex.unlock(key);

      return false;
    }

    const cooldown = user.used++ >= this.limit;

    if(cooldown && this.aggressive)
      user.reset = Date.now() + this.duration;

    this.mutex.unlock(key);

    return cooldown;
  }

  async revert(message) {
    const key = await this.getKey(message);

    await this.mutex.lock(key);

    if(!this.invalid(key))
      --this.users.get(key).used;

    this.mutex.unlock(key);
  }

  getKey(message) {
    if(typeof this.sorter === "function")
      return this.sorter(message);

    return `${message.author.id}${message.channel.guild == null ? "" : `-${message.channel.guild.id}`}`;
  }

  invalid(key) {
    return !this.users.has(key) || this.users.get(key).reset <= Date.now();
  }

  static validate(cooldown) {
    if(typeof cooldown.aggressive !== "boolean")
      throw TypeError("Cooldown#aggressive must be a boolean.");
    else if(typeof cooldown.duration !== "number")
      throw TypeError("Cooldown#duration must be a number.");
    else if(typeof cooldown.limit !== "number")
      throw TypeError("Cooldown#limit must be a number.");
    else if(cooldown.sorter != null && typeof cooldown.sorter !== "function")
      throw TypeError("Cooldown#sorter must be a function if defined.");
    else if(cooldown.expires != null && typeof cooldown.expires !== "number")
      throw TypeError("Cooldown#expires must be a number if defined.");
  }
}

module.exports = Cooldown;
