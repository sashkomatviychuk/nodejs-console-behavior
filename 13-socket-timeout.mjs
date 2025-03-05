import { createServer } from 'node:net';

const TIMEOUT_SEC = 1;

const server = createServer((socket) => {
  socket.on('data', (data) => {
    socket.setKeepAlive(true, TIMEOUT_SEC * 1000);

    const request = data.toString();
    // console.log('Received request:\n', request);

    // Extract the first line of the request
    const [requestLine, ...headers] = request.split('\r\n');
    const [method, path, httpVersion] = requestLine.split(' ');

    console.log(`Method: ${method}, Path: ${path}, HTTP Version: ${httpVersion}`);

    const response =
      `HTTP/1.1 200 OK\r\n` +
      'Connection: keep-alive\r\n' +
      `Content-Type: text/html\r\n` +
      `Keep-Alive: timeout=${TIMEOUT_SEC}, max=100\r\n` +
      'X-Content-Type-Options: nosniff\r\n' +
      'Transfer-Encoding: chunked\r\n' +
      `\r\n`;

    socket.write(response);

    let count = 1;

    // Stream new lines every second
    const interval = setInterval(() => {
      const chunk = `<div>Line ${count}</div>`;
      const chunkSize = chunk.length.toString(16);

      socket.write(`${chunkSize}\r\n${chunk}\r\n`);
      count++;

      if (count > 10) {
        clearInterval(interval);

        // End chunked transfer
        socket.write('0\r\n\r\n');
        socket.end();
      }
    }, 1000);

    // Close the connection manually
    // socket.end();
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(4001, () => {
  console.log('Server started on port 4001');
});

/**
 * Purpose of building custom http servers:
 *
 * Learning and Experimentation
 * Custom or Non-Standard Protocols Over HTTP
 * High-Performance or Minimal HTTP Server
 * Reverse Proxy or Load Balancer
 * Handling HTTP-like Requests from Non-Browser Clients
 */
