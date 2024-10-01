const fs = require('fs');

const writeStream = fs.createWriteStream('output.log');

const originalWrite = process.stdout.write;

process.stdout.write = writeStream.write.bind(writeStream);

console.log('This message will be printed to the file');
console.log('Second log to file');

writeStream.on('finish', () => {
  process.stdout.write = originalWrite;
  console.log('Writing is finished');
});

writeStream.end();
