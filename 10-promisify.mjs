import { readFile } from 'node:fs';

const promisify =
  (fn) =>
  (...args) =>
    new Promise((resolve, reject) => {
      const callback = (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      };

      fn(...args, callback);
    });

(async function () {
  const readFileAsync = promisify(readFile);

  try {
    const result = await readFileAsync('./.gitignore');
    console.dir(result.toString());
  } catch (e) {
    console.dir({ e });
  }
})();
