#!/usr/bin/env node
const fs = require('fs');

const readStream = fs.createReadStream('package.json');

let data;

readStream
  .setEncoding('utf-8')
  .on('data', (chunk) => {
    data += chunk;
  })
  .on('end', () => {
    console.log('end', data);
  });

const content = 'content \n';
const writeStream = fs.createWriteStream('output.txt');
writeStream.write(content, 'utf-8');
writeStream.end();

writeStream.on('finish', ()=> {
  console.log('finish');
});

writeStream.on('close', ()=> {
  console.log('close');
})

writeStream.on('error', ()=> {
  console.error('error');
})

let readStreamFirst = fs.createReadStream('package.json');
let writeStreamSecond = fs.createWriteStream('output.txt');

readStreamFirst.pipe(writeStreamSecond);
