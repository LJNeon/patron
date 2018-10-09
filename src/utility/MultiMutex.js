const Mutex = require('./Mutex.js');

/**
 * A Map of mutexes organized by an ID.
 */
class MultiMutex {
  constructor() {
    this.mutexes = new Map();
  }

  /**
   * Adds a task to the queue with the provided ID.
   * @async
   * @param {*} id The ID of the queue.
   * @param {AsyncFunction} task The task to execute.
   * @returns {Promise} The result of the task.
   */
  sync(id, task) {
    if (this.mutexes.has(id) === false) {
      this.mutexes.set(id, new Mutex());
    }

    return this.mutexes.get(id).sync(task);
  }
}

module.exports = MultiMutex;
