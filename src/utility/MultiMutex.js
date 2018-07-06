const Mutex = require("./Mutex.js");

class MultiMutex {
  constructor() {
    this.mutexes = new Map();
  }

  sync(id, task) {
    if (this.mutexes.has(id) === false) {
      this.mutexes.set(id, new Mutex());
    }

    return this.mutexes.get(id).sync(task);
  }
}

module.exports = MultiMutex;
