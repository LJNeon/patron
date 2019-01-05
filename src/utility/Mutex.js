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

/**
 * A mutex.
 */
class Mutex {
  constructor() {
    this.busy = false;
    this.queue = [];
  }

  dequeue() {
    this.busy = true;

    const next = this.queue.shift();

    if (next == null)
      this.busy = false;
    else
      this.execute(next);
  }

  async execute(record) {
    try {
      record.resolve(await record.task());
    } catch (e) {
      record.reject(e);
    } finally {
      this.dequeue();
    }
  }

  /**
   * Adds a task to the queue.
   * @param {function} task The task to execute.
   * @returns {Promise<*>} The result of the task.
   */
  sync(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        reject,
        resolve,
        task
      });

      if (this.busy === false)
        this.dequeue();
    });
  }
}

module.exports = Mutex;
