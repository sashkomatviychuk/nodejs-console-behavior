import { EventEmitter } from 'node:events';

class Deferred extends EventEmitter {
  #value = null;
  #status = 'pending';

  resolve(value) {
    this.#value = value;
    this.#status = 'resolve';
    this.emit('done', value);

    return this;
  }

  reject(value) {
    this.#value = value;
    this.#status = 'reject';
    this.emit('fail', value);

    return this;
  }

  async promise() {
    return new Promise((resolve, reject) => {
      this.on('done', (value) => resolve(value));
      this.on('error', (err) => reject(err));
    });
  }
}

const getUser = (id) => {
  const deferred = new Deferred();

  setTimeout(() => {
    deferred.resolve({ id, name: 'Name' });
  }, 1000);

  return deferred;
};

(async function () {
  try {
    const user = await getUser('123').promise();
    console.log({ user });
  } catch (e) {
    console.log({ e });
  }
})();
