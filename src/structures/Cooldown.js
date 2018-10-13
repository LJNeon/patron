const MultiMutex = require('../utility/MultiMutex.js');

/**
 * A command.
 * @prop {number} limit The amount of uses allowed before a user's cooldown resets.
 * @prop {number} time The time before a user's cooldown resets.
 * @prop {?function} sorter If present, sorts users into different cooldowns by returning a key to be used for that user when passed user ID and if applicable guild ID.
 */
class Cooldown {
  /**
   * @typedef {object} CooldownOptions The cooldown options, if a number is passed it's set to time and limit is set to 1.
   * @prop {number} limit The amount of uses allowed before a user's cooldown resets.
   * @prop {number} time The time in milliseconds before a user's cooldown resets.
   * @prop {?function} sorter If present, sorts users into different cooldowns by returning a key to be used for that user when passed user ID and if applicable guild ID.
   */

  /**
   * @param {number|CooldownOptions} options The cooldown options.
   */
  constructor(options) {
    if (typeof options === 'number') {
      this.time = options;
      this.limit = 1;
    } else {
      this.time = options.time;
      this.limit = options.limit;
      this.sorter = options.sorter;
    }

    this.users = {};
    this.mutex = new MultiMutex();

    this.constructor.validateCooldown(this);
  }

  /**
   * Gets a user's cooldown.
   * @param {string} userId The user ID.
   * @param {?string} guildId The guild ID, if applicable.
   * @returns {Promise<?object>} Resolves to a valid cooldown object or undefined.
   */
  get(userId, guildId) {
    return this.mutex.sync(this.parseMutex(guildId), async () => {
      const key = await this.parseKey(userId, guildId);

      if (!this.isInvalid(key)) {
        return this.users[key];
      }
    });
  }

  /**
   * Increments a user's cooldown.
   * @param {string} userId The user ID.
   * @param {?string} guildId The guild ID, if applicable.
   * @returns {boolean} Returns whether or not the user is on cooldown.
   */
  use(userId, guildId) {
    return this.mutex.sync(this.parseMutex(guildId), async () => {
      const key = await this.parseKey(userId, guildId);

      if (this.isInvalid(key)) {
        this.users[key] = {
          used: 1,
          resets: Date.now() + this.time
        };

        return false;
      }

      this.users[key].used++;

      return this.users[key].used >= this.limit;
    });
  }

  /**
   * Decrements a user's cooldown.
   * @param {string} userId The user ID.
   * @param {?string} guildId The guild ID, if applicable.
   * @returns {Promise} Resolves once the cooldown has been reverted.
   */
  revert(userId, guildId) {
    return this.mutex.sync(this.parseMutex(guildId), async () => {
      const key = await this.parseKey(userId, guildId);

      if (!this.isInvalid(key)) {
        this.users[key].used--;
      }
    });
  }

  isInvalid(key) {
    return this.users[key] == null || this.users[key].resets <= Date.now();
  }

  parseKey(userId, guildId) {
    if (this.sorter == null) {
      return userId + (guildId == null ? '' : '-' + guildId);
    }

    return this.sorter(userId, guildId);
  }

  parseMutex(guildId) {
    return guildId == null ? '' : guildId;
  }

  /**
   * Validates a cooldown.
   * @param {Cooldown} cooldown The cooldown to validate.
   * @private
   */
  static validateCooldown(cooldown) {
    if (typeof cooldown.time !== 'number') {
      throw new TypeError('Cooldown: The time must be a number.');
    } else if (typeof cooldown.limit !== 'number') {
      throw new TypeError('Cooldown: The limit must be a number.');
    } else if (cooldown.sorter != null && typeof cooldown.sorter !== 'function') {
      throw new TypeError('Cooldown: The sorter must be a function.');
    }
  }
}

module.exports = Cooldown;
