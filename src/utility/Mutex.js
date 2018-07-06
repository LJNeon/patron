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
