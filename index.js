const yargs = require("yargs/yargs");
const { hideBin} = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
    .option(
        'params1', {
            alias: "p1", 
            type: "boolean",
            description: "params1 description"
        })
    .option(
        'params2', {
            alias: "p2", 
            type: "boolean",
            description: "params2 description",
            default: "def params2"
        })
    .argv;

console.log(argv);