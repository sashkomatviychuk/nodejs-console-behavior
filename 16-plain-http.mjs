import { createServer } from 'http';

const server = createServer((req, res) => {
  console.log('request received');

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  res.end(
    JSON.stringify({
      success: true,
    })
  );
});

server.listen(3001);

server.on('listening', () => {
  console.log('server started on port 3001');
});
