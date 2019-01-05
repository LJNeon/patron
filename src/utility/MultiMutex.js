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
const Mutex = require("./Mutex.js");

/**
 * A Map of mutexes organized by IDs.
 */
class MultiMutex {
  constructor() {
    this.mutexes = new Map();
  }

  /**
   * Adds a task to the queue with the provided ID.
   * @param {*} id The ID of the queue.
   * @param {function} task The task to execute.
   * @returns {Promise<*>} The result of the task.
   */
  sync(id, task) {
    if (this.mutexes.has(id) === false)
      this.mutexes.set(id, new Mutex());

    return this.mutexes.get(id).sync(task);
  }
}

module.exports = MultiMutex;
