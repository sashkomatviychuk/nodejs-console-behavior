import { createHook, executionAsyncId } from 'node:async_hooks';
import { writeSync } from 'fs';

const asyncHook = createHook({
  init,
  destroy,
});

asyncHook.enable();

const contexts = new Map();

const generateId = () => Math.random().toString(32).substring(2);

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

async function main() {
  contexts.set(executionAsyncId(), {
    userId: generateId(),
  });

  console.log('Execution context of main', getCurrentContext());

  await test();
}

async function test() {
  return new Promise((resolve) => {
    console.log('Execution context of test fn:', getCurrentContext());
    return resolve();
  });
}

main();
main();
main();
