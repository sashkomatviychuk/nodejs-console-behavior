import { EventEmitter } from 'events';
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

class ContextualEventEmitter extends EventEmitter {
  emitWithContext(event, context, ...args) {
    asyncLocalStorage.run(context, () => {
      try {
        this.emit(event, ...args);
      } catch (error) {
        this.emit('error', error, context);
      }
    });
  }
}

const emitter = new EventEmitter();
const contextualEmitter = new ContextualEventEmitter();

emitter.on('data', (data) => {
  console.log(`Received: ${data}`);
  throw new Error('Something went wrong!');
});

try {
  emitter.emit('data', 'test data');
} catch (err) {
  console.log(err.message);
}

contextualEmitter.on('data', (data) => {
  console.log(`Received: ${data}`);
  throw new Error('Something went wrong!');
});

contextualEmitter.on('error', (error, context) => {
  console.error(`Error caught for event with context:`, context, '\nError:', error.message);
});

contextualEmitter.emitWithContext('data', { requestId: 123 }, 'test data');

class Timer extends EventEmitter {
  run(seconds) {
    setTimeout(() => {
      this.emit('end');
    }, seconds * 1000);
  }
}

const time1s = new Timer();

time1s.on('end', () => {
  console.log('timer1s ended!');
});

time1s.run(1);
