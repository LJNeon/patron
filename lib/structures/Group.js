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
const Cooldown = require("./Cooldown.js");
const InvalidOptions = require("../utils/InvalidOptions.js");

class Group {
  constructor(options) {
    if(InvalidOptions(options))
      throw ReferenceError("The Group constructor requires an options object.");

    this.cooldowns = options.cooldown == null ? undefined : new Cooldown(options.cooldown);
    this.description = options.description;
    this.name = options.name;
    this.postconditionOptions = options.postconditionOptions == null ? [] : options.postconditionOptions;
    this.postconditions = options.postconditions == null ? [] : options.postconditions;
    this.preconditionOptions = options.preconditionOptions == null ? [] : options.preconditionOptions;
    this.preconditions = options.preconditions == null ? [] : options.preconditions;
    Group.validate(this);
  }

  async getCooldown(userId, guildId) {
    if(this.cooldowns != null)
      return this.cooldowns.get(userId, guildId);
  }

  async useCooldown(userId, guildId) {
    if(this.cooldowns == null)
      return false;

    return this.cooldowns.use(userId, guildId);
  }

  async revertCooldown(userId, guildId) {
    if(this.cooldowns != null)
      this.cooldowns.revert(userId, guildId);
  }

  static validate(group) {
    if(group.description != null && typeof group.description !== "string")
      throw TypeError("Group#description must be a string if defined.");
    else if(typeof group.name !== "string")
      throw TypeError("Group#name must be a string.");
    else if(!Array.isArray(group.postconditionOptions))
      throw TypeError("Group#postconditionOptions must be an array.");
    else if(!Array.isArray(group.postconditions) || group.postconditions.some(pcnd => typeof pcnd !== "string"))
      throw TypeError("Group#postconditions must be an array of strings.");
    else if(!Array.isArray(group.preconditionOptions))
      throw TypeError("Group#preconditionOptions must be an array.");
    else if(!Array.isArray(group.preconditions) || group.preconditions.some(pcnd => typeof pcnd !== "string"))
      throw TypeError("Group#preconditions must be an array of strings.");
  }
}

module.exports = Group;
