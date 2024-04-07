#!/usr/bin/env node

const http = require('http');

const myAPIKey = process.env.myAPIKey;
const url = `http://data.fixer.io/api/latest?access_key=${myAPIKey}&symbols=USD,EUR,RUB`;

http.get(url, (response)=> {
  const {statusCode} = response;
  console.log(statusCode);
  if (statusCode !== 200) {
    console.log('Error', statusCode);
    return;
  }

  response.setEncoding('utf-8');

  let rawData = '';
  response.on('data', (chunk)=> {
    rawData += chunk;
  })
  response.on('end', ()=> {
    let parsedData = JSON.parse(rawData);
    console.log(parsedData);
  }).on('error', (error) => console.log(error));
});