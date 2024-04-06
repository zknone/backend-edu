#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const path = require('path');

function guessNumber() {
  const secretNumber = Math.floor(Math.random() * 1);
  console.log('Решка подброшена');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askUser() {
    rl.question('Введите число: ', (userInput) => {
      const userNumber = parseInt(userInput);

      if (isNaN(userNumber)) {
        console.log('Пожалуйста, введите корректное число.');
        askUser();
      } else {
        if (userNumber === secretNumber) {
          console.log(`Отгадано число ${secretNumber}`);
          rl.close();
        } else if (userNumber < secretNumber) {
          console.log('Больше');
          askUser();
        } else {
          console.log('Меньше');
          askUser();
        }
      }
    });
  }

  askUser();
}

guessNumber();

