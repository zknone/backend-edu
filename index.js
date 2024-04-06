#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const yargs = require("yargs/yargs");
const { hideBin} = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).
option(
  'play', {
      alias: "play", 
      type: "string",
      description: "add to file"
  })
.option(
  'read', {
      alias: "read", 
      type: "string",
      description: "read file",
  })
.argv;

const fileName = argv._[1];
const work = argv._[0];

const log = path.join(__dirname, 'public', fileName);

function writeResult (isCorrect) {
  const logLine = `{isCorrect: ${isCorrect}}, \n`;
  fs.appendFile(log, logLine, (error)=> {
    if (error) throw Error(error)
  })
}

const MAX = 2;
const MIN = 1;

function guessDie() {
  const die = Math.floor(Math.random() * MAX) + MIN;
  console.log('Орел(1) или решка(2)');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askUser() {
    rl.question('Что выбираешь? Орел (1) или решку(2): ', (userInput) => {
      const userNumber = parseInt(userInput);

      function repeatYourAnswer() {
        console.log('Выберите орел или решку!');
        askUser();
      }

      if (isNaN(userNumber)) {
        repeatYourAnswer();
      } else {
        if (userNumber === die) {
          console.log(`Правильно ${die === 2 ? 'Решка': 'Орел'}`);
          writeResult(true);
          rl.close();
        } else if (userNumber > MAX) {
          repeatYourAnswer();
        } else if (userNumber < MIN) {
          repeatYourAnswer();
        } else {
          console.log('Вы ошиблись!');
          writeResult(false);
          rl.close();
        }
      }
    });
  }
  askUser();
}

if (work === 'play') {
  guessDie();
}

if (work === 'read') {
  console.log(log);
  const readStream = fs.createReadStream(log);
  let data = '';

  readStream
  .setEncoding('utf-8')
  .on('data', (chunk) => {
    data += chunk;
  })
  .on('end', () => {
    const adaptedData = data.split(', \n');
    adaptedData.pop();
    const transformedData = adaptedData.map(item => {
      const cleanedItem = item.replace(/'/g, '"');
      return JSON.parse(cleanedItem);
    });

    const loses = transformedData.filter(item => item.isCorrect === false).length;
    const wins = transformedData.filter(item => item.isCorrect === true).length;
    const ratio = ((wins / transformedData.length) * 100).toFixed(0);

    console.log('Общее количество партий', transformedData.length);
    console.log('Количество побед', wins);
    console.log('Количество поражений', loses);
    console.log('Процента ваших побед', `${ratio} %`);

  });


}


