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
"use strict";

/**
 * A mutex.
 */
class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  dequeue() {
    this.locked = true;

    if(this.queue.length === 0)
      this.locked = false;
    else
      this.queue[0]();
  }

  /**
   * Requests a lock from the Mutex.
   * @returns {Promise} Resolves once the lock has been obtained.
   */
  lock() {
    return new Promise(res => {
      this.queue.push(res);

      if(!this.locked)
        this.dequeue();
    });
  }

  /**
   * Releases a lock back to the Mutex.
   */
  unlock() {
    this.queue.shift();
    this.dequeue();
  }
}

module.exports = Mutex;
