#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin} = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
    .option(
        '-y', {
            alias: "--year", 
            type: "boolean",
            description: "current year"
        })
    .option(
        '-m', {
            alias: "--month", 
            type: "number" | "boolean",
            description: "current month",
        })
    .argv;

const operator = argv._[0];

const getCurrentDate = (argv) => {
    if (argv["--year"] || argv["-y"]) return new Date().getFullYear();
    if (argv["--month"] || argv["-m"]) return new Date().getMonth();
    if (argv["--date"] || argv["-d"]) return new Date().getTime();
    return new Date();
}

const constructDate = (thingToProcess, toDo) => {
    const amount = argv[thingToProcess];
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getMonth();

    return `${toDo} ${amount} ${thingToProcess} – ${day} ${month} ${year}`;
}

const processDate = (argv, toDo) => {
    if (argv["day"] || argv["d"]) return constructDate("day", toDo);
    if (argv["month"] || argv["m"]) return constructDate("month", toDo);
    return 'You passed incorrect data';
}



switch (operator) {
    case 'current':
        console.log(getCurrentDate(argv));
        break;
    case 'add': 
        console.log(processDate(argv, 'add'));
        break
    case 'sub': 
        console.log(processDate(argv, 'sub'));
        break;
    default: break;
}