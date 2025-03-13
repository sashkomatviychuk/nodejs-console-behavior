import { createConnection } from 'net';

(function () {
  const connection = createConnection({ host: 'localhost', port: 1337 });

  connection.on('connect', function () {
    console.log('connected to server');
  });
  connection.on('error', function (err) {
    console.log('Error in connection:', err);
  });
  connection.on('close', function () {
    console.log('Client has been disconnected from the server');
  });

  connection.pipe(process.stdout, { end: false });

  process.stdin.pipe(connection);
})();
