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

    if (next == null) {
      this.busy = false;
    } else {
      this.execute(next);
    }
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
   * @async
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

      if (this.busy === false) {
        this.dequeue();
      }
    });
  }
}

module.exports = Mutex;
