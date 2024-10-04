import { AsyncLocalStorage } from 'async_hooks';
import { createServer } from 'http';

const asyncLocalStorage = new AsyncLocalStorage();

const generateId = () => Math.random().toString(32).substring(2);

const store = new Map();

createServer((req, res) => {
  asyncLocalStorage.run(store, () => {
    const userId = generateId();
    const store = asyncLocalStorage.getStore();
    store.set('userId', userId);

    setTimeout(() => {
      const store = asyncLocalStorage.getStore();

      res.writeHead(200);
      res.end(`User ID: ${store.get('userId')}`);
    }, 100);
  });
}).listen(8081);
