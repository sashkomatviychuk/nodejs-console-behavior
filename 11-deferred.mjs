import { EventEmitter } from 'node:events';

const DEFERRED_PENDING = 0;
const DEFERRED_RESOLVED = 1;
const DEFERRED_REJECTED = 2;

class Deferred extends EventEmitter {
  #value = null;
  #status = DEFERRED_PENDING;

  resolve(value) {
    this.#value = value;
    this.#status = DEFERRED_RESOLVED;
    this.emit('done', value);
  }

  reject(value) {
    this.#value = value;
    this.#status = DEFERRED_REJECTED;
    this.emit('fail', value);
  }

  done(callback) {
    this.on('done', callback);

    if (this.#status === DEFERRED_RESOLVED) {
      callback(this.#value);
    }

    return this;
  }

  fail(callback) {
    this.on('fail', callback);

    if (this.#status === DEFERRED_REJECTED) {
      callback(this.#value);
    }

    return this;
  }

  async promise() {
    return new Promise((resolve, reject) => {
      this.done(resolve);
      this.fail(reject);
    });
  }
}

const getUser = (id) => {
  const deferred = new Deferred();

  setTimeout(() => {
    deferred.resolve({ id, name: 'John Doe' });
  }, 1000);

  return deferred;
};

(async function () {
  const userPromise = await getUser('123')
    .fail((err) => console.log({ err }))
    .done((user) => console.log({ user }))
    .promise();

  console.log({ userPromise });
})();
