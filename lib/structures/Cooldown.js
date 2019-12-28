/*
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2019  patron contributors
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
const InvalidOptions = require("../utils/InvalidOptions.js");
const MultiMutex = require("../utils/MultiMutex.js");

/**
 * Atomic cooldowns used for Commands.
 */
class Cooldown {
  /**
   * @typedef {Object} CooldownOptions The Cooldown options.
   * @prop {Boolean} [aggressive=false] The cooldown will be set back to the full
   * duration whenever it's used past the limit.
   * @prop {Number} duration The duration of the cooldown in milliseconds.
   * @prop {Number} [limit=1] The maximum amount of uses allowed per user.
   * @prop {Function} [sorter] Allows custom sorting of user cooldowns, should return a key used to determine
   * which cooldown will be applied. The function will be passed a user ID and if applicable a guild ID.
   * `sorter(userId, ?guildId)`
   * @prop {Number} [expires] The age entries should be deleted at in minutes. Entires won't be cleared
   * when this value isn't provided.
   */

  /**
   * @arg {(Number|CooldownOptions)} options The Cooldown options, if a number is passed it will set Cooldown#duration.
   */
  constructor(options) {
    if(typeof options === "number") {
      this.aggressive = false;
      this.duration = options;
      this.limit = 1;
      this.sorter = undefined;
      this.expires = undefined;
    }else if(InvalidOptions(options)) {
      throw ReferenceError("The Cooldown constructor requires a number or options object.");
    }else{
      this.aggressive = options.aggressive == null ? false : options.aggressive;
      this.duration = options.duration;
      this.limit = options.limit == null ? 1 : options.limit;
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

  /**
   * Requests a user's cooldown status.
   * @param {String} userId The user's ID.
   * @param {String} [guildId] The guild ID, if applicable.
   * @returns {Promise<?Object>} Resolves to a cooldown object, or undefined if no cooldown was found.
   */
  async get(userId, guildId) {
    const key = this.getKey(userId, guildId);

    await this.mutex.lock(key);

    if(!this.invalid(key))
      return this.users.get(key);

    this.mutex.unlock(key);
  }

  /**
   * Activates a user's cooldown.
   * @param {String} userId The user's ID.
   * @param {String} [guildId] The guild ID, if applicable.
   * @returns {Promise<Boolean>} Whether or not the user is currently on cooldown.
   */
  async use(userId, guildId) {
    const key = this.getKey(userId, guildId);

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

  /**
   * Reverts the last use of a user's cooldown.
   * @param {String} userId The user's ID.
   * @param {String} [guildId] The guild ID, if applicable.
   * @returns {Promise} Resolves once the cooldown has been reverted.
   */
  async revert(userId, guildId) {
    const key = this.getKey(userId, guildId);

    await this.mutex.lock(key);

    if(!this.invalid(key))
      --this.users.get(key).used;

    this.mutex.unlock(key);
  }

  getKey(userId, guildId) {
    if(typeof this.sorter === "function")
      return this.sorter(userId, guildId);

    return `${userId}${guildId == null ? "" : `-${guildId}`}`;
  }

  invalid(key) {
    return !this.users.has(key) || this.users.get(key).reset <= Date.now();
  }

  static validate(cd) {
    if(typeof cd.aggressive !== "boolean")
      throw TypeError("Cooldown#aggressive must be a boolean.");
    else if(typeof cd.duration !== "number")
      throw TypeError("Cooldown#duration must be a number.");
    else if(typeof cd.limit !== "number")
      throw TypeError("Cooldown#limit must be a number.");
    else if(cd.sorter != null && typeof cd.sorter !== "function")
      throw TypeError("Cooldown#sorter must be a function if defined.");
  }
}

module.exports = Cooldown;
