// @ts-check

import { createConnection, Socket } from 'net';
import { createPool, Pool } from 'generic-pool';

// helpers

// end helpers

export class DbClient {
  /** @type {string | null} */
  #host = null;
  /** @type {number | null} */
  #port = null;
  /** @type {Socket | null} */
  #connection = null;

  /**
   *
   * @param {string} host
   * @param {number} port
   */
  constructor(host, port) {
    this.#host = host;
    this.#port = port;
    this.#connection = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.#connection = createConnection({ host: this.#host, port: this.#port }, () => {
        resolve();
      });

      this.#connection.on('error', (err) => {
        console.log(`Connection error:`, err);
        this.#connection = null;
        reject(err);
      });

      this.#connection.on('end', () => {
        this.#connection = null;
        console.log('Disconnected from server');
      });
    });
  }

  async disconnect() {
    return new Promise((resolve) => {
      if (this.#connection) {
        this.#connection.end(() => {
          this.#connection = null;
          resolve();
        });
      }
    });
  }

  /**
   * @param {string} command
   */
  async sendCommand(command) {
    return new Promise((resolve, reject) => {
      if (!this.#connection) {
        return reject(new Error('No server connection'));
      }

      this.#connection.write(command);

      this.#connection.once('data', (data) => {
        const response = data.toString().trim();

        console.log('Server response:', response);

        const [type, message] = response.split(': ');

        if (type === 'OK') {
          return resolve(message);
        } else if (type === 'ERROR') {
          return reject(new Error(message));
        } else {
          return reject(new Error('Unregognized response type'));
        }
      });
    });
  }

  /**
   * @param {string} key
   * @returns
   */
  async get(key) {
    return await this.sendCommand(`GET ${key}`);
  }

  /**
   * @param {string} key
   * @param {string|number} value
   * @returns
   */
  async set(key, value) {
    return await this.sendCommand(`SET ${key} ${value}`);
  }
}

class DbClientPoll {
  /** @type {number | null} */
  #poolSize = null;

  /** @type {Pool<DbClient> | null} */
  #pool = null;

  /**
   * @param {string} host
   * @param {number} port
   * @param {number} poolSize
   */
  constructor(host, port, poolSize) {
    this.#poolSize = poolSize;

    this.#pool = createPool(
      {
        create: async () => {
          const client = new DbClient(host, port);
          await client.connect();
          return client;
        },
        destroy: (client) => client.disconnect(),
      },
      {
        max: poolSize,
        min: 2,
        acquireTimeoutMillis: 30000,
      }
    );
  }

  /**
   *
   * @param {string} command
   */
  async #sendCommand(command) {
    const client = await this.#pool.acquire();

    try {
      const result = await client.sendCommand(command);
      return result;
    } finally {
      this.#pool.release(client);
    }
  }

  /**
   * @param {string} key
   * @returns
   */
  async get(key) {
    return await this.#sendCommand(`GET ${key}`);
  }

  /**
   * @param {string} key
   * @param {string|number} value
   * @returns
   */
  async set(key, value) {
    return await this.#sendCommand(`SET ${key} ${value}`);
  }

  async close() {
    await this.#pool.drain();
    await this.#pool.clear();
  }
}

(async function () {
  //
  const client = new DbClient('localhost', 1337);
  const pool = new DbClientPoll('localhost', 1337, 5);

  await client.connect();

  await client.set('name', 'Alice');
  await client.set('age', 28);

  const name = await client.get('name');
  const age = await client.get('age');

  console.log({ name, age });

  const namePool = await pool.get('name');

  console.log({ namePool });

  await client.disconnect();
  await pool.close();
})();
