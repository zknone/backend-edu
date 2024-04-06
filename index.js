#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// console.log(path.parse(__filename));
// console.log(path.join(__filename, 'test', '..', '//demo.txt'));

const dir = path.join(__dirname, 'demo');
// fs.mkdir(dir, (error) => {
//   if (error) throw Error(error);
//   console.log('Done!');
// });

const file = path.join(__dirname, 'demo', 'new.txt');

// fs.mkdir(file, (error) => {
//   if (error) throw Error(error);
//   console.log('Done!');
// });

const content = 'content \n';

// fs.writeFile(file, content, (error) => {
//   if (error) throw Error(error);
//   console.log('Done!');
// })

fs.appendFile(file, content, (error) => {
  if (error) throw Error(error);
  console.log('Edited!');
})

fs.readFile(file, 'utf-8',(error, data) => {
  if (error) throw Error(error);
  console.log(data);
});