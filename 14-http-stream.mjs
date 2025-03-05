import http from 'http';

async function* generateData() {
  for (let i = 0; i < 1000; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    yield `data chunk ${i}\n`;
  }
}

const server = http.createServer(async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
    Connection: 'keep-alive',
    'X-Content-Type-Options': 'nosniff',
  });

  for await (const chunk of generateData()) {
    res.write(chunk);
    console.log(`Sent: ${chunk}`);
  }

  req.on('end', () => {
    res.end();
  });
});

const PORT = 4001;

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
