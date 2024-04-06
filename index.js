#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const log = path.join(__dirname, 'public', 'log.txt');

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

guessDie();

