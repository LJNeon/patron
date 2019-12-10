/*
 * patron.js - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2019  patron.js contributors
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
import {Cooldown} from "./Cooldown.js";
import InvalidOptions from "../utils/InvalidOptions.js";

/**
 * A group of Commands.
 * @prop {?Cooldown} cooldowns Cooldown options and all user cooldowns.
 * @prop {?String} description A description of the group.
 * @prop {String} name The group's name.
 * @prop {Array<*>} postconditionOptions The options provided to the Postconditions when ran.
 * @prop {Array<String>} postconditions The names of Postconditions to run on the group's commands.
 * @prop {Array<*>} preconditionOptions The options provided to the Preconditions when ran.
 * @prop {Array<String>} preconditions The names of Preconditions to run on the group's commands.
 */
class Group {
  /**
   * @arg {Object} options The Group options.
   * @arg {(Number|CooldownOptions)} [cooldown] The Cooldown options, if a number is passed
   * it will set Cooldown#duration.
   * @arg {String} [description] A description of the group.
   * @arg {String} name The group's name.
   * @arg {Array<*>} [postconditionOptions] The options provided to the Postconditions when ran.
   * @arg {Array<String>} [postconditions] The names of Postconditions to run on the group's commands.
   * @arg {Array<*>} [preconditionOptions] The options provided to the Preconditions when ran.
   * @arg {Array<String>} [preconditions] The names of Preconditions to run on the group's commands.
   */
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

  /**
   * Requests a user's cooldown status for this group of commands.
   * @param {String} userId The user's ID.
   * @param {String} [guildId] The guild ID, if applicable.
   * @returns {Promise<?Object>} Resolves to a cooldown object, or undefined if no cooldown was found.
   */
  async getCooldown(userId, guildId) {
    if(this.cooldowns != null)
      return this.cooldowns.get(userId, guildId);
  }

  /**
   * Activates a user's cooldown for this group of commands.
   * @param {String} userId The user's ID.
   * @param {String} [guildId] The guild ID, if applicable.
   * @returns {Promise<Boolean>} Whether or not the user is currently on cooldown.
   */
  async useCooldown(userId, guildId) {
    if(this.cooldowns == null)
      return false;

    return this.cooldowns.use(userId, guildId);
  }

  /**
   * Reverts the last use of a user's cooldown for this group of commands.
   * @param {String} userId The user's ID.
   * @param {String} [guildId] The guild ID, if applicable.
   * @returns {Promise} Resolves once the cooldown has been reverted.
   */
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

export {Group};
