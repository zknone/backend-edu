const http = require('http');
const yargs = require('yargs');
const { hideBin} = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).argv;

const city = argv._[0];

console.log(city);