async function runWithCancelOnReject(tasks) {
  const controller = new AbortController();
  const { signal } = controller;

  const wrappedTasks = tasks.map(async (task, i) => {
    try {
      return await task(signal);
    } catch (err) {
      controller.abort();
      throw err;
    }
  });

  return Promise.all(wrappedTasks);
}

// --- USAGE:

function createTask(id, delay, shouldFail = false) {
  return (signal) =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.log('working on task', id);

        if (shouldFail) {
          reject(new Error(`Task ${id} failed`));
        } else {
          resolve(`Task ${id} done`);
        }
      }, delay);

      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error(`Task ${id} aborted`));
      });
    });
}

async function main() {
  const tasks = [createTask(1, 1000), createTask(2, 1500, true), createTask(3, 2000)];

  try {
    const results = await runWithCancelOnReject(tasks);
    console.log('All done:', results);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
