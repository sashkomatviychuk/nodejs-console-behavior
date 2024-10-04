import { createServer } from 'net';

// helpers

function isFunction(value) {
  return typeof value === 'function';
}

function wrapWithNL(str) {
  return `${str}\n`;
}

function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function splitString(input) {
  const regex = /"([^"]+)"|([^\s]+)/g;
  let matches;
  const result = [];

  while ((matches = regex.exec(input)) !== null) {
    result.push(matches[1] || matches[2]);
  }

  return result;
}

// end helpers

const SERVER_PORT = 1337;
const database = {};

const routes = {
  SET: (key, value) => {
    logWithTimestamp(`Set "${value}" to key "${key}"`);
    database[key] = value;
    return `OK: ${value}`;
  },
  GET: (key) => {
    logWithTimestamp(`Requesting value for key "${key}"`);
    const value = database[key] || '';
    return `OK: ${value}`;
  },
  AUTH: (login, password) => {
    // check user exist
    return 'ERROR: Wrong credentials';
  },
};

const server = createServer((socket) => {
  logWithTimestamp('New client connected!');

  socket.on('data', (buffer) => {
    const message = buffer.toString().trim();
    const [command, key, value] = splitString(message);

    const fn = routes[command];

    if (!isFunction(fn)) {
      return socket.write(wrapWithNL(`ERROR: Illegal command name "${command}"`));
    }

    const response = fn(key, value);

    socket.write(wrapWithNL(response));
  });

  socket.on('end', () => {
    logWithTimestamp('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error(`[${new Date().toISOString()}]`, 'Socket error:', err);
  });
});

server.listen(SERVER_PORT, () => {
  logWithTimestamp(`Starting server on port ${SERVER_PORT}`);
});
