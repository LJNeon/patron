/**
 * A mutex.
 * @prop {boolean} busy Whether or not the Mutex has tasks in it's queue.
 * @prop {object[]} queue The actual queue, an array of tasks to be completed.
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

  execute(record) {
    record.task()
      .then(record.resolve, record.reject)
      .then(() => this.dequeue());
  }

  /**
   * Adds a task to the queue.
   * @async
   * @param {AsyncFunction} task The task to execute.
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
