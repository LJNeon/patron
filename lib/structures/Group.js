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
const {invalidOptions} = require("../utils/structUtil.js");

class Group {
  constructor(options) {
    if(invalidOptions(options))
      throw ReferenceError("The Group constructor requires an options object.");

    this.cooldowns = options.cooldown == null ? Group.defaults.cooldowns : new Cooldown(options.cooldown);
    this.description = options.description;
    this.name = options.name;
    this.postconditionOptions = options.postconditionOptions ?? Group.defaults.postconditionOptions;
    this.postconditions = options.postconditions ?? Group.defaults.postconditions;
    this.preconditionOptions = options.preconditionOptions ?? Group.defaults.preconditionOptions;
    this.preconditions = options.preconditions ?? Group.defaults.preconditions;
    Group.validate(this);
  }

  static setDefaults(options) {
    Group.defaults = {
      cooldowns: options.cooldown == null ? undefined : new Cooldown(options.cooldown),
      postconditionOptions: options.postconditionOptions ?? [],
      postconditions: options.postconditions ?? [],
      preconditionOptions: options.preconditionOptions ?? [],
      preconditions: options.preconditions ?? []
    };
    Group.validate(Group.defaults, true);
  }

  getCooldown(userId, guildId) {
    return this.cooldowns?.get(userId, guildId);
  }

  useCooldown(userId, guildId) {
    return this.cooldowns?.use(userId, guildId) ?? false;
  }

  revertCooldown(userId, guildId) {
    return this.cooldowns?.revert(userId, guildId);
  }

  static validate(group, defaults = false) {
    if(group.description != null && typeof group.description !== "string")
      throw TypeError("Group#description must be a string if defined.");
    else if(!defaults && typeof group.name !== "string")
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

Group.defaults = {
  cooldowns: undefined,
  postconditionOptions: [],
  postconditions: [],
  preconditionOptions: [],
  preconditions: []
};

module.exports = Group;
