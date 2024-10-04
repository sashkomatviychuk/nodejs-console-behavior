import { createHook, executionAsyncId } from 'node:async_hooks';
import { writeSync } from 'fs';
import { createServer } from 'http';

const contexts = new Map();

const generateId = () => Math.random().toString(32).substring(2);

const asyncHook = createHook({
  init,
  destroy,
});

asyncHook.enable();

function init(asyncId, type, triggerAsyncId, resource) {
  if (contexts.has(triggerAsyncId)) {
    contexts.set(asyncId, contexts.get(triggerAsyncId));
  }
  // writeSync(1, JSON.stringify({ asyncId, type, triggerAsyncId }) + '\n');
}

function destroy(asyncId) {
  writeSync(1, `Destroyed async op: ${asyncId}\n`);
}

function getCurrentContext() {
  return contexts.get(executionAsyncId());
}

createServer((req, res) => {
  const userId = generateId();

  contexts.set(executionAsyncId(), { userId });

  setTimeout(() => {
    const context = getCurrentContext();

    res.writeHead(200);
    res.end(`User ID: ${context.userId}`);
  }, 100);
}).listen(8080);
